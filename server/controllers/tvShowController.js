import { tmdbApi } from '../utils/tmdbClient.js';

const fetchShowLists = async (req, res) => {
    const { listType } = req.query;

    try {
        const { data } = await tmdbApi.get(`/tv/${listType}`);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const fetchSeasonDetails = async (req, res) => {
    const { id, seasonNo } = req.query;

    try {
        const { data } = await tmdbApi.get(`/tv/${id}/season/${seasonNo}`);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const fetchEpisodeGroup = async (req, res) => {
    const { id } = req.query;

    try {
        const { data } = await tmdbApi.get(`/tv/${id}/episode_groups`);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const fetchGroupInfo = async (req, res) => {
    const { groupId } = req.query;

    try {
        const { data } = await tmdbApi.get(`/tv/episode_group/${groupId}`);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { fetchShowLists, fetchSeasonDetails, fetchEpisodeGroup, fetchGroupInfo };
