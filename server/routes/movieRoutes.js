const router = require("express").Router();
const {
    fetchMovieLists,
    fetchMovieDetails,
    fetchCrewInfo,
    fetchRecommendation,
    fetchSimilar } = require("../controllers/movieController");

// route for fetching popular movies
router.route("/list").get(fetchMovieLists);

// route for fetching movie details
router.route("/details").get(fetchMovieDetails);

// route for fetching crew data
router.route("/crew").get(fetchCrewInfo);

// route for fetching recommendation
router.route("/recommend").get(fetchRecommendation);

// route for fetching similar movies
router.route("/similar").get(fetchSimilar);

module.exports = router;