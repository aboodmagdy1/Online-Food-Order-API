import dotenv from "dotenv";
dotenv.config();
import express from "express"; // this syntax is best for typescript projects (ES6)
import path from "path";
import bodyParser from "body-parser";
import { VendorRoute, AdminRoute } from "./routes";
import { connectDB } from "./config";

const app = express();

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // this is for parsing form data
app.use(express.static(path.join(__dirname, "images")));

// // routes
app.use("/admin", AdminRoute);
app.use("/vendor", VendorRoute);

app.get("/", (req, res) => {
  res.json("hello from express");
});

// connect to db

connectDB();

//running server
app.listen(3000, () => {
  console.clear(); // clear console on every restart
  console.log("Server is running on port 3000");
});
