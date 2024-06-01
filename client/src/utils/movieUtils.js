import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_TOKEN = import.meta.env.VITE_APP_TMDB_TOKEN;

const headers = {
    Authorization: `Bearer ${TMDB_TOKEN}`,
    accept: 'application/json',
};

const fetchDataFromApi = async (url, params) => {
    try {
        const { data } = await axios.get(BASE_URL + url, { headers, params });
        return data;
    }

    catch (error) {
        console.log(error);
        return error;
    }
};

const fetchMediaDetails = async (media, endpoint, options) => {
    try {
        const response = await axios.get(`${BASE_URL}/${endpoint}/${media.id}`, { headers, ...options });
        const movieDetailsData = response.data;

        return movieDetailsData;
    }
    catch (error) {
        console.error('Error fetching movie details:', error);
    }
};

export { fetchDataFromApi, fetchMediaDetails };