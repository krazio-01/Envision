import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../api/apiClient';
import Carousel from '../../../components/carousel/Carousel';

const Recommendation = ({ mediaType, id }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    const fetchRecommendation = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/media/recommend?id=${id}&mediaType=${mediaType}`);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, [id, mediaType]);

    useEffect(() => {
        fetchRecommendation();
    }, [fetchRecommendation]);

    return (
        <>
            {data?.results?.length > 0 ? (
                <Carousel title="Recommendations" data={data?.results} loading={loading} endpoint={mediaType} />
            ) : (
                <div style={{ padding: '20px 0', textAlign: 'center', color: 'gray' }}>
                    <span>No recommendations available.</span>
                </div>
            )}
        </>
    );
};

export default Recommendation;
