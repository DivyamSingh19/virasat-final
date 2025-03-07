import express from "express"
import { loginUser, registerUser, loginAlumni, registerAlumni, adminLogin } from "../controllers/userController"

const userRouter = express.Router()

userRouter.post('/login-user',loginUser)
userRouter.post('/admin',adminLogin)
userRouter.post('/register-user',registerUser)
userRouter.post('/login-alumni',loginAlumni)
userRouter.post('/register-alumni',registerAlumni)


export default userRouter;