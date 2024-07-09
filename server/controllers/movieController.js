import dotEnv from "dotenv";
import axios from "axios";
dotEnv.config();

const BASE_URL = "https://api.themoviedb.org/3";

const headers = {
    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    accept: "application/json",
};

const fetchMovieLists = async (req, res) => {
    const { listType, timeWindow } = req.query;

    try {
        let url;
        if (listType === "trending") url = `${BASE_URL}/trending/movie/${timeWindow}`;
        else url = `${BASE_URL}/movie/${listType}`;

        const response = await axios.get(url, { headers });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { fetchMovieLists };
