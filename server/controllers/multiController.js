import dotEnv from "dotenv";
import axios from "axios";
dotEnv.config();

const baseURL = "https://api.themoviedb.org/3";

const headers = {
    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    accept: "application/json",
};

const fetchSuggestions = async (req, res) => {
    const { query } = req.query;

    try {
        const { data } = await axios.get(`${baseURL}/search/multi?query=${query}`, { headers });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const Search = async (req, res) => {
    const { query, page } = req.query;

    try {
        const [data] = await axios.get(`${baseURL}/search/multi?query=${query}&page=${page}`, {
            headers,
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { fetchSuggestions, Search };
