import dotEnv from "dotenv";
import axios from "axios";
dotEnv.config();

const baseURL = "https://api.themoviedb.org/3";

const headers = {
    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    accept: "application/json",
};

const Search = async (req, res) => {
    const { query, page } = req.query;

    try {
        const response = await axios.get(`${baseURL}/search/multi?query=${query}&page=${page}`, {
            headers,
        });
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching reusults:", error);
    }
};

export { Search };
