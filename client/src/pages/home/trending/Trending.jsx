import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../api/apiClient';
import Carousel from '../../../components/carousel/Carousel';
import ContentWrapper from '../../../components/contentWrapper/ContentWrapper';
import SwitchTabs from '../../../components/Ui/switchTabs/SwitchTabs';
import '../home.css';

const Trending = () => {
    const [endpoint, setEndpoint] = useState('day');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchTrendingMedia = useCallback(async (timeWindow) => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/movie/list?listType=trending&timeWindow=${timeWindow}`);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching trending data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTrendingMedia(endpoint);
    }, [endpoint, fetchTrendingMedia]);

    const onTabChange = useCallback((tab) => {
        setEndpoint(tab === 'Day' ? 'day' : 'week');
    }, []);

    return (
        <div className="carouselSection">
            <ContentWrapper>
                <span className="carouselTitle">Trending</span>
                <SwitchTabs data={['Day', 'Week']} onTabChange={onTabChange} />
            </ContentWrapper>

            <Carousel data={data?.results} loading={loading} endpoint={'movie'} />
        </div>
    );
};

export default Trending;
