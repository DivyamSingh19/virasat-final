import express from "express";
import upload from "../middleware/multer.js";

const uploadRouter = express.Router();

uploadRouter.post('/add',adminAuth)

export default uploadRouter;
