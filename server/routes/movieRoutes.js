import { Router } from "express";
import { fetchMovieLists } from "../controllers/movieController.js";

const router = Router();

// Route for fetching popular movies
router.route("/list").get(fetchMovieLists);

export default router;
