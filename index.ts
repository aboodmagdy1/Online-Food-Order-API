import dotenv from "dotenv";
dotenv.config();
import express from "express"; // this syntax is best for typescript projects (ES6)
import { connectDB } from "./config";
import App from './services/expressApp'

const starterServer = async ()=>{
  const app = express();
   connectDB() 
   await App(app)
app.listen(3000,()=>{
  console.log(`server running in port 3000`)
})
}


starterServer()