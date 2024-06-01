const router = require("express").Router();
const {
    fetchShowLists,
    fetchShowDetails,
    fetchSeasonDetails,
    fetchEpisodeGroup,
    fetchGroupInfo,
    fetchCrewInfo,
    fetchRecommendation,
    fetchSimilar } = require("../controllers/tvShowController");

// route for fetching tv show details
router.route("/list").get(fetchShowLists);

// route for fetching tv show details
router.route("/details").get(fetchShowDetails);

// route for fetching tv show season details
router.route("/season_details").get(fetchSeasonDetails);

// route for fetching tv show episode groups
router.route("/episode_groups").get(fetchEpisodeGroup);

// route for fetching episodes
router.route("/group_info").get(fetchGroupInfo);

// route for fetching crew data
router.route("/crew").get(fetchCrewInfo);

// route for fetching recommendation
router.route("/recommend").get(fetchRecommendation);

// route for fetching similar tv shows
router.route("/similar").get(fetchSimilar);

module.exports = router;