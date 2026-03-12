import { tmdbApi } from '../utils/tmdbClient.js';

const fetchMovieLists = async (req, res) => {
    const { listType, timeWindow } = req.query;

    try {
        let url = listType === 'trending' ? `/trending/movie/${timeWindow}` : `/movie/${listType}`;

        const { data } = await tmdbApi.get(url);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { fetchMovieLists };
