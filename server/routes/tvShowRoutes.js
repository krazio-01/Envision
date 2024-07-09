import { Router } from "express";
import {
    fetchShowLists,
    fetchSeasonDetails,
    fetchEpisodeGroup,
    fetchGroupInfo,
} from "../controllers/tvShowController.js";

const router = Router();

// Route for fetching TV show details
router.route("/list").get(fetchShowLists);

// Route for fetching TV show season details
router.route("/season_details").get(fetchSeasonDetails);

// Route for fetching TV show episode groups
router.route("/episode_groups").get(fetchEpisodeGroup);

// Route for fetching episodes
router.route("/group_info").get(fetchGroupInfo);

export default router;
