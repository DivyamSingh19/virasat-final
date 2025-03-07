import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

 
const allowedImageFormats = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const allowedPdfFormat = ["application/pdf"];

 
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let folder = "uploads";  

        if (file.mimetype.startsWith("image/")) {
            if (req.body.type === "post") folder = "posts";
            if (req.body.type === "event") folder = "events";
            if (req.body.type === "forum") folder = "forums";
            if (req.body.type === "job") folder = "jobs";
            if (req.body.type === "profile") folder = "profile_pictures";
        } else if (file.mimetype === "application/pdf") {
            folder = "resumes";
        }

        return {
            folder: folder,
            resource_type: "auto",
            format: file.mimetype === "application/pdf" ? "pdf" : "webp", 
        };
    },
});

 
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (allowedImageFormats.includes(file.mimetype) || allowedPdfFormat.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only images and PDFs are allowed!"), false);
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, //5 MB Limit
});

export default upload;
