const fs = require('fs');
const csvParser = require('csv-parser');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Controller for uploading a CSV file containing admin records.
 * The CSV file is expected to have columns: "username", "email", "password".
 *
 * This function uses req.file (provided by Multer) to read and parse the CSV file.
 * It then creates admin records in the database, avoiding duplicates.
 */
const uploadAdminCsv = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded." });
  }

  const admins = [];
  const filePath = req.file.path;

 
  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      admins.push(row);
    })
    .on('end', async () => {
      try {
        // Process each CSV row.
        for (const row of admins) {
          const { username, email, password } = row;

          // Check if an admin record for this email already exists.
          const existingAdmin = await prisma.admin.findUnique({ where: { email } });
          if (!existingAdmin) {
            // Hash the incoming password before storing it.
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.admin.create({
              data: {
                username,
                email,
                password: hashedPassword,
              },
            });
          }
        }
        res.status(200).json({ success: true, message: "Admin CSV processed successfully." });
      } catch (processingError) {
        console.error("Error processing CSV rows:", processingError);
        res.status(500).json({ success: false, message: "Error processing CSV rows." });
      }
    })
    .on('error', (err) => {
      console.error("Error reading CSV file:", err);
      res.status(500).json({ success: false, message: "Error reading CSV file." });
    });
};

module.exports = {
  uploadAdminCsv,
};