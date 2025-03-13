// require('dotenv').config({path: './env'})
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});

const port = process.env.PORT || 7000;
// console.log(connectDB())
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.error("error: ", error);
      throw error;
    });
    app.listen(port, () => {
      console.log(`Server running on port number : ${port}`);
    });
  })
  .catch((error) => {
    console.log("connection fail error :", error);
  });

















/*import express from "express";

const app = express();

;(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

    app.on("error",(error)=>{
        console.log("ERROR: ", error);
        throw error;
    })

    app.listen(process.env.PORT, () =>
      console.log(`Example app listening on port ${process.env.PORT}!`)
    );


  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }

})(); //IIFE
*/
