import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express, {
  Application,
  ErrorRequestHandler,
  NextFunction
} from "express";
import morgan from "morgan";
// Database
import "./config/database";
import routes from "./routes";
// Middleware
const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());

// Routes
app.use("/api", routes);

// Server listening
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

// Handle errors
app.use(<ErrorRequestHandler>function (err, req, res, next: NextFunction) {
  res.status(err.status ?? 500);
  res.json({
    success: false,
    error: "Internal error occurred",
  });
  next(err);
});
