const express = require('express');
const experienceRouter = express.Router();
import {
  createExperience,
  getExperiences,
  updateExperience,
  deleteExperience,
} from "../controllers/experienceController.js"

 
experienceRouter.post('/', createExperience);
 
experienceRouter.get('/', getExperiences);
 
experienceRouter.put('/', updateExperience);

 
experienceRouter.delete('/', deleteExperience);

module.exports = experienceRouter;