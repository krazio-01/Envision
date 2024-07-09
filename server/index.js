import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import tvShowRoutes from "./routes/tvShowRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import multiRoutes from "./routes/multiRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import cookieParser from "cookie-parser";

// Load environment variables from .env file
dotenv.config();

// Initialize the express application
const app = express();
const PORT = process.env.PORT || 8800;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.error("Error while connecting to DB", err);
        process.exit(1);
    });

// Middleware setup
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/bookmark", bookmarkRoutes);
app.use("/api/tv", tvShowRoutes);
app.use("/api/movie", movieRoutes);
app.use("/api/multi", multiRoutes);
app.use("/api/media", mediaRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
