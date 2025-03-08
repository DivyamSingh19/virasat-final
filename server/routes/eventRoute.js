import express from "express"
import { loginUser, registerUser, loginAlumni, registerAlumni, adminLogin } from "../controllers/userController.js"

const eventRouter = express.Router()

eventRouter.post('/login-user',loginUser)
eventRouter.post('/admin',adminLogin)
eventRouter.post('/register-user',registerUser)
eventRouter.post('/login-alumni',loginAlumni)
eventRouter.post('/register-alumni',registerAlumni)


export default eventRouter;