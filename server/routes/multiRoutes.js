import { Router } from "express";
import { fetchSuggestions, Search } from "../controllers/multiController.js";

const router = Router();

// route for fetching suggestions
router.route("/suggestions").get(fetchSuggestions);

// Route for searching data
router.route("/search").get(Search);

export default router;
