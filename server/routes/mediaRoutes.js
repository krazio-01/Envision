import { Router } from "express";
import {
    fetchMediaDetails,
    fetchGenres,
    discoverMedia,
    fetchCrewInfo,
    fetchRecommendation,
    fetchSimilar,
} from "../controllers/mediaController.js";

const router = Router();

// route for fetching media details
router.route("/details").get(fetchMediaDetails);

// route for fetching media genres
router.route("/genres").get(fetchGenres);

// route for discovering media
router.route("/discover").get(discoverMedia);

// route for fetching crew data
router.route("/crew").get(fetchCrewInfo);

// route for fetching recommendation
router.route("/recommend").get(fetchRecommendation);

// route for fetching similar movies
router.route("/similar").get(fetchSimilar);

export default router;
