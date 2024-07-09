import dotEnv from "dotenv";
import axios from "axios";
dotEnv.config();

const baseURL = "https://api.themoviedb.org/3/tv";

const headers = {
    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    accept: "application/json",
};

const fetchShowLists = async (req, res) => {
    const { listType } = req.query;

    try {
        const response = await axios.get(`${baseURL}/${listType}`, { headers });
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching Tv Show list:", error.message);
    }
};

const fetchSeasonDetails = async (req, res) => {
    const { id, seasonNo } = req.query;

    try {
        const response = await axios.get(`${baseURL}/${id}/season/${seasonNo}`, { headers });
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching Season details:", error.message);
    }
};

const fetchEpisodeGroup = async (req, res) => {
    const { id } = req.query;

    try {
        const response = await axios.get(`${baseURL}/${id}/episode_groups`, { headers });
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching Episode Group:", error.message);
    }
};

const fetchGroupInfo = async (req, res) => {
    const { groupId } = req.query;

    try {
        const response = await axios.get(`${baseURL}/episode_group/${groupId}`, { headers });
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching Group info:", error.message);
    }
};

export { fetchShowLists, fetchSeasonDetails, fetchEpisodeGroup, fetchGroupInfo };
