const dotEnv = require('dotenv');
const axios = require('axios');
dotEnv.config();

const baseURL = "https://api.themoviedb.org/3/tv";

const headers = {
    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    accept: 'application/json',
};

const fetchShowLists = async (req, res) => {
    const { listType } = req.query;

    try {
        const response = await axios.get(`${baseURL}/${listType}`, { headers });
        res.json(response.data);
    }
    catch (error) {
        console.error('Error fetching Tv Show list:', error.message);
    }
};

const fetchShowDetails = async (req, res) => {
    const { id } = req.query;

    try {
        const response = await axios.get(`${baseURL}/${id}`, { headers });
        res.json(response.data);
    }
    catch (error) {
        console.error('Error fetching TV show details:', error.message);
    }
};

const fetchSeasonDetails = async (req, res) => {
    const { id, seasonNo } = req.query;

    try {
        const response = await axios.get(`${baseURL}/${id}/season/${seasonNo}`, { headers });
        res.json(response.data);
    }
    catch (error) {
        console.error('Error fetching Season details:', error.message);
    }
};

const fetchEpisodeGroup = async (req, res) => {
    const { id } = req.query;

    try {
        const response = await axios.get(`${baseURL}/${id}/episode_groups`, { headers });
        res.json(response.data);
    }
    catch (error) {
        console.error('Error fetching Episode Group:', error.message);
    }
};

const fetchGroupInfo = async (req, res) => {
    const { groupId } = req.query;

    try {
        const response = await axios.get(`${baseURL}/episode_group/${groupId}`, { headers });
        res.json(response.data);
    }
    catch (error) {
        console.error('Error fetching Group info:', error.message);
    }
};

const fetchCrewInfo = async (req, res) => {
    const { id } = req.query;

    try {
        const response = await axios.get(`${baseURL}/${id}/credits`, { headers });
        res.json(response.data);
    }
    catch (error) {
        console.error('Error fetching Crew info:', error.message);
    }
};

const fetchRecommendation = async (req, res) => {
    const { id } = req.query;

    try {
        const response = await axios.get(`${baseURL}/${id}/recommendations`, { headers });
        res.json(response.data);
    }
    catch (error) {
        console.error('Error fetching Recommendation:', error.message);
    }
};

const fetchSimilar = async (req, res) => {
    const { id } = req.query;

    try {
        const response = await axios.get(`${baseURL}/${id}/similar`, { headers });
        res.json(response.data);
    }
    catch (error) {
        console.error('Error fetching Similar Shows:', error.message);
    }
};

module.exports = {
    fetchShowLists,
    fetchShowDetails,
    fetchSeasonDetails,
    fetchEpisodeGroup,
    fetchGroupInfo,
    fetchCrewInfo,
    fetchRecommendation,
    fetchSimilar
};