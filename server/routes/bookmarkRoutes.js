import { fetchBookmarks, addBookmark, removeBookmark } from "../controllers/bookmarkController.js";
import authMiddleware from "../middlewares/authMiddlerware.js";
import express from "express";
const router = express.Router();

// add bookmark endpoint
router.get("/fetchBookmarks", authMiddleware, fetchBookmarks);

// add bookmark endpoint
router.post("/addBookmark", authMiddleware, addBookmark);

// add bookmark endpoint
router.post("/removeBookmark", authMiddleware, removeBookmark);

export default router;
