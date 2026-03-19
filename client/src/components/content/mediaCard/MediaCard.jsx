import { useState, memo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import apiClient from '../../../api/apiClient';
import { PuffLoader } from 'react-spinners';
import HoverCard from '../../hoverCard/HoverCard';
import { generateImageUrl } from '../../../utils/movieUtils';
import Img from '../../lazyLoadImage/Img';
import './mediaCard.css';

const EDGE_THRESHOLD = 32;

const MediaCard = ({ item, endpoint, showDeleteBtn, setIsRemoved }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [containerStyle, setContainerStyle] = useState({
        left: 'var(--edge-offset)',
    });

    const containerRef = useRef();
    const abortControllerRef = useRef(null);

    const { id, media_type, name, title, poster_path, release_date, first_air_date } = item;

    const initialSeason = getInitialValue(`currentSeason_${id}`, 1);
    const initialEpisode = getInitialValue(`currentEpisode_${id}`, 1);

    const date = dayjs(endpoint === 'movie' ? release_date : first_air_date);
    const formattedDate = date.format('YYYY');

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, []);

    const handleMouseEnter = async () => {
        if (details) return;

        const container = containerRef.current;
        if (container) {
            const rect = container.getBoundingClientRect();
            const isNearRightEdge = rect.right >= window.innerWidth - EDGE_THRESHOLD;
            const isNearLeftEdge = rect.left <= EDGE_THRESHOLD;

            setContainerStyle((prevStyle) => {
                if (isNearRightEdge) return { right: 'var(--edge-offset)' };
                else if (isNearLeftEdge) return { left: 'var(--edge-offset)' };
                else return prevStyle;
            });

            if (abortControllerRef.current) abortControllerRef.current.abort();

            abortControllerRef.current = new AbortController();

            try {
                setLoading(true);
                const { data } = await apiClient.get(`/media/details?mediaType=${endpoint}&id=${id}`, {
                    signal: abortControllerRef.current.signal,
                });

                setDetails(data);
                setLoading(false);
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log(`API call aborted for ${name || title} - user moved mouse away.`);
                } else {
                    console.error('Error fetching details:', error);
                    setLoading(false);
                }
            }
        }
    };

    const handleMouseLeave = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    };

    return (
        <div className="media-item" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Link
                to={`/${media_type || endpoint}/${name || title}/${id}/${initialSeason}/${initialEpisode}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
                <div className="posterBlock">
                    <Img src={generateImageUrl(poster_path)} />
                </div>
                <div className="textBlock">
                    <span className="title">{name || title}</span>
                    <div className="misc">
                        <span>{endpoint === 'movie' ? 'Movie' : 'TV Show'}</span>
                        <span>{formattedDate}</span>
                    </div>
                </div>
            </Link>

            <div className="info-container" style={containerStyle} ref={containerRef}>
                {loading ? (
                    <div className="loader">
                        <PuffLoader color="#EA2027" loading={loading} size={35} />
                    </div>
                ) : (
                    <HoverCard
                        details={details}
                        mediaType={endpoint || media_type}
                        showDeleteBtn={showDeleteBtn}
                        setIsRemoved={setIsRemoved}
                    />
                )}
            </div>
        </div>
    );
};

export default memo(MediaCard);

function getInitialValue(key, defaultValue) {
    return Number((sessionStorage.getItem(key) || '').match(/\d+/)) || defaultValue;
}
