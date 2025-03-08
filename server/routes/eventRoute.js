import express from 'express';
import { createEvent, registerForEvent } from '../controllers/eventController.js';

const eventRouter = express.Router();

eventRouter.post('/create', createEvent);
eventRouter.post('/register', registerForEvent);

export default eventRouter;
