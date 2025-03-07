import connectCloudinary from "./config/cloudinary.js";
import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import userRouter from "./routes/userRoute.js";
import forumRouter from "./routes/forumRoute.js";
 
const app = express();
const port = 4000;
app.use(express.json());
app.use(cors())
dotenv.config()
connectCloudinary();

 


app.use('/api/user',userRouter)
app.use('/api/forum',forumRouter)












app.get('/',(req,res)=>{
  res.json({"message":"It works"}) //trial
})

//Global Catch
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  res.status(500).json({ error: 'Something went wrong!' });
};
app.listen(port)