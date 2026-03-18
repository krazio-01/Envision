import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../api/apiClient';
import Carousel from '../../../components/carousel/Carousel';

const Similar = ({ mediaType, id }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    const fetchSimilarMedia = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/media/similar?id=${id}&mediaType=${mediaType}`);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, [id, mediaType]);

    useEffect(() => {
        fetchSimilarMedia();
    }, [fetchSimilarMedia]);

    const title = mediaType === 'tv' ? 'Similar TV Shows' : 'Similar Movies';

    return <Carousel title={title} data={data?.results} loading={loading} endpoint={mediaType} />;
};

export default Similar;
