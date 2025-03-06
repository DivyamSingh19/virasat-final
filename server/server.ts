import express from "express"
import { Request,Response } from "express";
import cors from "cors"
const app = express();
const port = 4000;
app.use(express.json());
app.use(cors())

app.get('/',(req:Request,res:Response)=>{
  res.json({"message":"It works"})
})

app.listen(port)