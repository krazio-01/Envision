import axios from 'axios';

const BASE_URL = "https://api.themoviedb.org/3";

export const tmdbApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        accept: 'application/json',
    },
});
