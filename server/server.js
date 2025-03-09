import connectCloudinary from "./config/cloudinary.js";
import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import userRouter from "./routes/userRoute.js";
import forumRouter from "./routes/forumRoute.js";
import commentRouter from "./routes/commentRoute.js";
import dataUploadRouter from "./routes/dataUploadRoute.js";
import eventRouter from "./routes/eventRoute.js";
const app = express();
const port = 4000;
app.use(express.json());
app.use(cors())
dotenv.config()
connectCloudinary();

 


app.use('/api/user',userRouter)
app.use('/api/forum',forumRouter)
app.use("/api/comments", commentRouter);
app.use("/api/dataupload",dataUploadRouter);
app.use("/api/events",eventRouter)

app.get('/',(req,res)=>{
  res.json({"message":"It works"}) //trial
})

//Global Catch
app.use((err, req, res, next) => {
  if (err.name === 'MulterError') {
    return res.status(400).json({ error: `File upload error: ${err.message}` });
  }
  res.status(500).json({ error: err.message || 'Something went wrong' });
});


app.listen(port)