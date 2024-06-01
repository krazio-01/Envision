const router = require("express").Router();
const { fetchSuggestions, Search } = require("../controllers/multiController");

// route for fetching suggestions
router.route("/suggestions").get(fetchSuggestions);

// route for searcching data
router.route("/search").get(Search);

module.exports = router;