const dotEnv = require('dotenv');
const axios = require('axios');
dotEnv.config();

const baseURL = "https://api.themoviedb.org/3";

const headers = {
    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    accept: 'application/json',
};

const fetchMovieLists = async (req, res) => {
    const { listType, timeWindow } = req.query;

    try {
        let url;
        if (listType === "trending")
            url = `${baseURL}/trending/movie/${timeWindow}`;
        else
            url = `${baseURL}/movie/${listType}`;

        const response = await axios.get(url, { headers });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching movie list:', error);
    }
};

const fetchMovieDetails = async (req, res) => {
    const { id } = req.query;

    try {
        const response = await axios.get(`${baseURL}/movie/${id}`, { headers });
        res.json(response.data);
    }
    catch (error) {
        console.error('Error fetching Movie details:', error.message);
    }
};

const fetchCrewInfo = async (req, res) => {
    const { id } = req.query;

    try {
        const response = await axios.get(`${baseURL}/movie/${id}/credits`, { headers });
        res.json(response.data);
    }
    catch (error) {
        console.error('Error fetching Crew info:', error.message);
    }
};

const fetchRecommendation = async (req, res) => {
    const { id } = req.query;

    try {
        const response = await axios.get(`${baseURL}/movie/${id}/recommendations`, { headers });
        res.json(response.data);
    }
    catch (error) {
        console.error('Error fetching Recommendation:', error.message);
    }
};

const fetchSimilar = async (req, res) => {
    const { id } = req.query;

    try {
        const response = await axios.get(`${baseURL}/movie/${id}/similar`, { headers });
        res.json(response.data);
    }
    catch (error) {
        console.error('Error fetching Similar Movies:', error.message);
    }
};

module.exports = {
    fetchMovieLists,
    fetchMovieDetails,
    fetchCrewInfo,
    fetchRecommendation,
    fetchSimilar
};