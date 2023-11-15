import mongoose from "mongoose";


export const connectDB =  () => {
mongoose
.connect(`${process.env.DB_URI}`)
.then((result) => {
  console.log("connected to db successfuly ");
})
.catch((err) => {
  console.log("error in connecting to db" + err);
});
}