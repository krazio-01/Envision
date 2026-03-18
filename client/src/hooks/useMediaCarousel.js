import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const useMediaCarousel = (initialEndpoint, listType) => {
    const [endpoint, setEndpoint] = useState(initialEndpoint);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(`/${endpoint}/list?listType=${listType}`);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMedia();
    }, [endpoint, listType]);

    const onTabChange = (tab) => {
        setEndpoint(tab === 'Movies' ? 'movie' : 'tv');
    };

    return { data, loading, endpoint, onTabChange };
};

export default useMediaCarousel;
