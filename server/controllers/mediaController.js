import dotEnv from "dotenv";
import axios from "axios";
dotEnv.config();

const BASE_URL = "https://api.themoviedb.org/3";

const headers = {
    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    accept: "application/json",
};

const fetchMediaDetails = async (req, res) => {
    const { id, mediaType } = req.query;

    try {
        const { data } = await axios.get(`${BASE_URL}/${mediaType}/${id}`, { headers });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const fetchGenres = async (req, res) => {
    const { mediaType } = req.query;

    try {
        const { data } = await axios.get(`${BASE_URL}/genre/${mediaType}/list`, { headers });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const discoverMedia = async (req, res) => {
    const { mediaType, page, ...filters } = req.query;

    try {
        const { data } = await axios.get(`${BASE_URL}/discover/${mediaType}`, {
            params: { page, ...filters },
            headers,
        });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const fetchCrewInfo = async (req, res) => {
    const { id, mediaType } = req.query;

    try {
        const { data } = await axios.get(`${BASE_URL}/${mediaType}/${id}/credits`, { headers });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const fetchRecommendation = async (req, res) => {
    const { id, mediaType } = req.query;

    try {
        const { data } = await axios.get(`${BASE_URL}/${mediaType}/${id}/recommendations`, {
            headers,
        });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const fetchSimilar = async (req, res) => {
    const { id, mediaType } = req.query;

    try {
        const { data } = await axios.get(`${BASE_URL}/${mediaType}/${id}/similar`, { headers });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {
    fetchMediaDetails,
    fetchGenres,
    discoverMedia,
    fetchCrewInfo,
    fetchRecommendation,
    fetchSimilar,
};
