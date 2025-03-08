import express from "express"
import multer from "multer"
import {uploadAlumniCsv,uploadStudentCsv} from '../controllers/dataUploadController.js'
 

const dataUploadRouter = express.Router();
const upload = multer({ dest: 'uploads/' });
 
dataUploadRouter.post('/upload-alumni-csv', upload.single('file'), uploadAlumniCsv);

 
dataUploadRouter.post('/upload-student-csv', upload.single('file'), uploadStudentCsv);


export default dataUploadRouter