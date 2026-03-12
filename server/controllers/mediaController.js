import { tmdbApi } from '../utils/tmdbClient.js';

const fetchMediaDetails = async (req, res) => {
    const { id, mediaType } = req.query;

    try {
        const { data } = await tmdbApi.get(`/${mediaType}/${id}`);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const fetchGenres = async (req, res) => {
    const { mediaType } = req.query;

    try {
        const { data } = await tmdbApi.get(`/genre/${mediaType}/list`);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const discoverMedia = async (req, res) => {
    const { mediaType, page, ...filters } = req.query;

    try {
        const { data } = await tmdbApi.get(`/discover/${mediaType}`, {
            params: { page, ...filters },
        });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const fetchCrewInfo = async (req, res) => {
    const { id, mediaType } = req.query;

    try {
        const { data } = await tmdbApi.get(`/${mediaType}/${id}/credits`);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const fetchRecommendation = async (req, res) => {
    const { id, mediaType } = req.query;

    try {
        const { data } = await tmdbApi.get(`/${mediaType}/${id}/recommendations`);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const fetchSimilar = async (req, res) => {
    const { id, mediaType } = req.query;

    try {
        const { data } = await tmdbApi.get(`/${mediaType}/${id}/similar`);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { fetchMediaDetails, fetchGenres, discoverMedia, fetchCrewInfo, fetchRecommendation, fetchSimilar };
