
import express, { Application } from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

import userRoutes from "./routes/users";
import authRoutes from "./routes/auths";
import tweetRoutes from "./routes/tweets";

const app:Application = express()
dotenv.config();

const connectWithDB = () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.DATABASE as string)
    .then(() => {
      console.log("Connected to database");
    })
    .catch((err) => {
      throw err;
    });
};

app.use(cookieParser());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tweets", tweetRoutes);

app.listen(process.env.PORT, () => {
  connectWithDB(),
  console.log("Server Running on Port" + process.env.PORT)
});