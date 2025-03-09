import express from 'express';
import jobController from "../controllers/jobController.js"
const jobRouter = express.Router();
 
const auth = require('../middleware/auth');

 
jobRouter.get('/', jobController.getAllJobs);
jobRouter.get('/:id', jobController.getJobById);
jobRouter.get('/alumni/:alumniId', jobController.getJobsByAlumni);
 
jobRouter.post('/', auth.verifyAlumni, jobController.createJob);
jobRouter.put('/:id', auth.verifyAlumni, jobController.updateJob);
jobRouter.delete('/:id', auth.verifyAlumni, jobController.deleteJob);
jobRouter.patch('/:id/status', auth.verifyAlumni, jobController.toggleJobStatus);

export default jobRouter;