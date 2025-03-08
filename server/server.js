import connectCloudinary from "./config/cloudinary.js";
import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import userRouter from "./routes/userRoute.js";
import forumRouter from "./routes/forumRoute.js";
import commentRouter from "./routes/commentRoute.js";
import dataUploadRouter from "./routes/dataUploadRoute.js";
const app = express();
const port = 4000;
app.use(express.json());
app.use(cors())
dotenv.config()
connectCloudinary();

 


app.use('/api/user',userRouter)
app.use('/api/forum',forumRouter)
app.use("/api/comments", commentRouter);
app.use("/api/dataupload",dataUploadRouter)

app.get('/',(req,res)=>{
  res.json({"message":"It works"}) //trial
})

//Global Catch
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  res.status(500).json({ error: 'Something went wrong!' });
};
app.listen(port)