import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import csvParser from "csv-parser";
import fs from "fs";
import fetch from "node-fetch"; // Ensure this is installed
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🔹 Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// 🔹 Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "csv_uploads",
    format: async () => "csv",
    resource_type: "raw",
  },
});

const upload = multer({ storage });

// 🔹 Upload and Process CSV
const uploadCsv = async (req, res, type) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded." });
  }

  try {
    console.log("Uploading to Cloudinary...");
    const result = await cloudinary.uploader.upload(req.file.path, { resource_type: "raw" });

    console.log("Uploaded to Cloudinary:", result.secure_url);

    // 🔹 Fetch file from Cloudinary & parse it
    const tempFilePath = `./temp_${Date.now()}.csv`;

    console.log("Downloading CSV from Cloudinary...");
    const response = await fetch(result.secure_url);
    const buffer = await response.buffer(); 

    fs.writeFileSync(tempFilePath, buffer);
    console.log("CSV downloaded successfully. Parsing...");

    const records = [];
    const skippedRecords = [];

    fs.createReadStream(tempFilePath)
      .pipe(csvParser())
      .on("data", (row) => {
        console.log("Parsed row:", row);
        records.push(row);
      })
      .on("end", async () => {
        try {
          const results = {
            processed: 0,
            withDefaultValues: 0,
            errors: 0
          };

          for (const record of records) {
            // Handle all possible data formats and provide defaults
            const fullName = record["Full Name"]?.trim() || 
                            record["FullName"]?.trim() || 
                            record["Name"]?.trim() || 
                            "Unknown Name";
                            
            // Default to current year if graduation year is invalid
            const currentYear = new Date().getFullYear();
            let graduationYear = Number(record["Graduation Year"]);
            if (isNaN(graduationYear)) {
              graduationYear = currentYear;
              results.withDefaultValues++;
            }
            
            const prnNumber = record["prn_number"]?.trim() || 
                             record["PRN"]?.trim() || 
                             record["PRN Number"]?.trim() || 
                             `DEFAULT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
                             
            const branch = record["Branch"]?.trim() || "Unknown";

            console.log(`Processing: ${fullName}, ${graduationYear}, Branch: ${branch}, PRN: ${prnNumber}`);

            try {
              if (type === "alumni") {
                await prisma.alumniData.upsert({
                  where: { 
                    // Use a composite key approach if fullName is not unique
                    fullName_graduationYear: {
                      fullName,
                      graduationYear
                    }
                  },
                  update: { branch },
                  create: { fullName, graduationYear, branch },
                });

                console.log(`✅ Inserted/Updated Alumni: ${fullName}`);
              } else if (type === "student") {
                await prisma.studentData.upsert({
                  where: { prn_number: prnNumber },
                  update: { fullName, graduationYear, branch },
                  create: { prn_number: prnNumber, fullName, graduationYear, branch },
                });

                console.log(`✅ Inserted/Updated Student: ${fullName} (PRN: ${prnNumber})`);
              }
              results.processed++;
            } catch (err) {
              console.error(`❌ Error processing record: ${fullName}`, err);
              skippedRecords.push({ record, error: err.message });
              results.errors++;
            }
          }

          // Remove temp file
          fs.unlinkSync(tempFilePath);
          return res.status(200).json({ 
            success: true, 
            message: `${type} CSV processed successfully.`, 
            results: {
              totalRecords: records.length,
              processed: results.processed,
              withDefaultValues: results.withDefaultValues,
              errors: results.errors,
              skippedRecords: skippedRecords.length > 0 ? skippedRecords : undefined
            }
          });
        } catch (err) {
          console.error("❌ Error processing CSV:", err);
          return res.status(500).json({ success: false, message: "Error processing CSV data" });
        }
      });
  } catch (error) {
    console.error("❌ Error handling CSV upload:", error);
    return res.status(500).json({ success: false, message: "CSV processing failed" });
  }
};

const uploadAlumniCsv = (req, res) => uploadCsv(req, res, "alumni");
const uploadStudentCsv = (req, res) => uploadCsv(req, res, "student");

export { uploadAlumniCsv, uploadStudentCsv, upload };