import { Router } from "express";
import { Search } from "../controllers/multiController.js";

const router = Router();

// Route for searching data
router.route("/search").get(Search);

export default router;
