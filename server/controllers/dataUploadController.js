import { PrismaClient } from '@prisma/client';
import fs from"fs"
import csvParser from "csv-parser"
 
 

const prisma = new PrismaClient();

 
const uploadAlumniCsv = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  const alumniRecords = [];
  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      alumniRecords.push(row);
    })
    .on('end', async () => {
      try {
        for (const record of alumniRecords) {
          const fullName = record['Full Name'];
          const graduationYear = Number(record['Graduation Year']);

           
          if (!fullName || !graduationYear) continue;

          
          const existingEntry = await prisma.alumniData.findFirst({
            where: {
              fullName,
              graduationYear,
            },
          });

          if (!existingEntry) {
            await prisma.alumniData.create({
              data: {
                fullName,
                graduationYear,
              },
            });
          }
        }
        return res.status(200).json({ success: true, message: 'Alumni CSV processed successfully.' });
      } catch (err) {
        console.error('Error processing alumni CSV rows:', err);
        return res.status(500).json({ success: false, message: 'Error processing alumni CSV rows.' });
      }
    })
    .on('error', (error) => {
      console.error('Error reading alumni CSV file:', error);
      return res.status(500).json({ success: false, message: 'Error reading alumni CSV file.' });
    });
};

 
const uploadStudentCsv = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  const studentRecords = [];
  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      studentRecords.push(row);
    })
    .on('end', async () => {
      try {
        for (const record of studentRecords) {
          const fullName = record['Full Name'];
          const graduationYear = Number(record['Graduation Year']);
          const prn_number = record['prn_number'];

        
          if (!fullName || !graduationYear || !prn_number) continue;
 
          const existingEntry = await prisma.studentData.findFirst({
            where: {
              fullName,
              graduationYear,
              prn_number,
            },
          });

          if (!existingEntry) {
            await prisma.studentData.create({
              data: {
                fullName,
                graduationYear,
                prn_number,
              },
            });
          }
        }
        return res.status(200).json({ success: true, message: 'Student CSV processed successfully.' });
      } catch (err) {
        console.error('Error processing student CSV rows:', err);
        return res.status(500).json({ success: false, message: 'Error processing student CSV rows.' });
      }
    })
    .on('error', (error) => {
      console.error('Error reading student CSV file:', error);
      return res.status(500).json({ success: false, message: 'Error reading student CSV file.' });
    });
};

export  {
  uploadAlumniCsv,
  uploadStudentCsv,
};