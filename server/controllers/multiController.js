const dotEnv = require('dotenv');
const axios = require('axios');
dotEnv.config();

const baseURL = "https://api.themoviedb.org/3";

const headers = {
    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    accept: 'application/json',
};

const fetchSuggestions = async (req, res) => {
    const { query } = req.query;

    try {
        const response = await axios.get(`${baseURL}/search/multi?query=${query}`, { headers });
        res.json(response.data);
    }
    catch (error) {
        console.error('Error fetching Suggestions:', error.message);
    }
};

const Search = async (req, res) => {
    const { query } = req.query;

    try {
        const response = await axios.get(`${baseURL}/search/multi?query=${query}`, { headers });
        res.json(response.data);
    }
    catch (error) {
        console.error('Error fetching Suggestions:', error.message);
    }
};

module.exports = { fetchSuggestions, Search };