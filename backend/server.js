import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectD from "./ConnectDb/ConnectDB.js";
import Userroute from "./Route/UserRoute.js";
import TaskRoute from "./Route/TaskRoute.js";
import Error from "./MiddleWare/Error.js";

process.on("uncaughtException", (err) => {
  console.error(`Uncaught exception: ${err.message}`);
  process.exit(1);
});

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);

app.use(cookieParser());

app.use("/api/v1", Userroute);
app.use("/api/v1", TaskRoute);

app.use(Error);

const Server = app.listen(PORT, () => {
  console.log(`Server is runing on ${PORT}`);
  connectD();
});

process.on("unhandledRejection", (err) => {
  console.log("Server rejected");
  console.error(`Unhandled Rejection: ${err.message}`);
  Server.close(() => {
    process.exit(1);
  });
});
