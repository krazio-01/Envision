import { tmdbApi } from '../utils/tmdbClient.js';

const fetchSuggestions = async (req, res) => {
    const { query } = req.query;

    try {
        const { data } = await tmdbApi.get('/search/multi', {
            params: { query },
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const Search = async (req, res) => {
    const { query, page } = req.query;

    try {
        const { data } = await tmdbApi.get('/search/multi', {
            params: { query, page },
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { fetchSuggestions, Search };
