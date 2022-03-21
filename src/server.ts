import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express, { Application } from "express";
import morgan from "morgan";
// Database
import "./config/database";
import routes from "./routes/index";

// Middleware
const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());

// Routes
app.use("/api", routes.authRouter);

// Server listening
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});