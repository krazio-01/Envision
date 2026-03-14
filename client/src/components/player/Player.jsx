import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateImageUrl } from '../../utils/movieUtils';
import dayjs from 'dayjs';
import axios from 'axios';
import BookmarkBtn from '../Ui/bookmarkBtn/BookmarkBtn';
import { IoPlayOutline, IoSettingsOutline } from 'react-icons/io5';
import { PuffLoader } from 'react-spinners';
import './player.css';

const Player = ({ media }) => {
    const { mediaType, id } = useParams();
    const navigate = useNavigate();

    const [currentSeason, setCurrentSeason] = useState(
        () => Number((sessionStorage.getItem(`currentSeason_${id}`) || '').match(/\d+/)) || 1,
    );
    const [currentEpisode, setCurrentEpisode] = useState(
        () => Number((sessionStorage.getItem(`currentEpisode_${id}`) || '').match(/\d+/)) || 1,
    );

    const [data, setData] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [episodeGroupExists, setEpisodeGroupExists] = useState(false);
    const [numberOfSeasons, setNumberOfSeasons] = useState(0);
    const [loading, setLoading] = useState(false);
    const [iframeVisible, setIframeVisible] = useState(false);
    const [iframeLoading, setIframeLoading] = useState(false);

    useEffect(() => {
        setIframeVisible(false);
        setIframeLoading(false);
        setShowMenu(false);
    }, [id]);

    useEffect(() => {
        let isMounted = true;

        const fetchEpisodeGroups = async () => {
            if (mediaType !== 'tv') return;

            try {
                setLoading(true);
                const response = await axios.get(`/${mediaType}/episode_groups?id=${id}`);

                if (!response.data.results || response.data.results.length === 0) {
                    if (isMounted) setLoading(false);
                    return;
                }

                const pick = response.data.results.reduce(
                    (prevItem, currentItem) =>
                        currentItem.group_count >= prevItem.group_count &&
                            currentItem.episode_count > prevItem.episode_count
                            ? currentItem
                            : prevItem,
                    response.data.results[0],
                );

                const groupInfo = await axios.get(`/${mediaType}/group_info?groupId=${pick.id}`);

                if (isMounted) {
                    setNumberOfSeasons(groupInfo.data.group_count);
                    setData(groupInfo.data);
                    setEpisodeGroupExists(true);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching data from the backend:', error.message);
                if (isMounted) setLoading(false);
            }
        };

        fetchEpisodeGroups();

        return () => {
            isMounted = false;
        };
    }, [mediaType, id]);

    useEffect(() => {
        sessionStorage.setItem(`currentSeason_${id}`, currentSeason);
        sessionStorage.setItem(`currentEpisode_${id}`, currentEpisode);
    }, [currentSeason, currentEpisode, id]);

    useEffect(() => {
        let isMounted = true;

        const fetchSeasonDetails = async () => {
            if (episodeGroupExists || mediaType !== 'tv') return;

            try {
                setLoading(true);
                const response = await axios.get(`/${mediaType}/season_details?id=${id}&seasonNo=${currentSeason}`);
                if (isMounted) {
                    setData(response.data);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching data from the backend:', error.message);
                if (isMounted) setLoading(false);
            }
        };

        fetchSeasonDetails();

        return () => {
            isMounted = false;
        };
    }, [currentSeason, episodeGroupExists, mediaType, id]);

    const iframeSrc = useMemo(
        () =>
            `https://vidsrcme.su/embed/${mediaType}/${id}${mediaType === 'tv' ? `/${currentSeason}/${currentEpisode}` : ''}`,
        [mediaType, id, currentSeason, currentEpisode],
    );

    const filteredSeasons = useMemo(
        () =>
            media?.seasons?.filter((season) => {
                const airDate = dayjs(season.air_date);
                return (!airDate.isAfter(dayjs()) && season.season_number !== 0) || airDate === null;
            }),
        [media?.seasons],
    );

    const handleEpSelect = useCallback(
        (season, episodeIndex) => {
            const selectedEpisode = episodeIndex + 1;
            setCurrentEpisode(selectedEpisode);
            navigate(`/${mediaType}/${media?.name || media?.title}/${id}/${season}/${selectedEpisode}`);
        },
        [navigate, mediaType, media?.name, media?.title, id],
    );

    const handleSeasonSelect = useCallback((seasonNum) => {
        setShowMenu(false);
        setCurrentSeason(seasonNum);
    }, []);

    const renderSeasonItems = () => {
        const seasons = episodeGroupExists
            ? Array.from({ length: numberOfSeasons || 0 }, (_, index) => index + 1)
            : filteredSeasons?.map((season) => season.season_number) || [];

        return seasons.map((seasonNum, index) => (
            <button
                key={index}
                type="button"
                className={`dropdown-item ${currentSeason === seasonNum ? 'active' : ''}`}
                data-comment-id={`envision_${index}`}
                data-season={seasonNum}
                onClick={() => handleSeasonSelect(seasonNum)}
                style={{ textAlign: 'left' }}
            >
                Season {seasonNum}
            </button>
        ));
    };

    const renderEpisodes = () => {
        const episodes = episodeGroupExists ? data?.groups[currentSeason - 1]?.episodes : data?.episodes;

        return episodes?.map((episode, episodeIndex) => (
            <div
                key={episodeIndex + 1}
                className="episode"
                onClick={() => handleEpSelect(currentSeason, episodeIndex)}
                style={{ cursor: 'pointer' }}
            >
                <div className={`${currentEpisode === episodeIndex + 1 ? 'active' : ''}`}>
                    <span className="episode-num">Episode {episodeIndex + 1}</span>
                    <span className="episode-name">{episode.name}</span>
                </div>
            </div>
        ));
    };

    return (
        <>
            <div className="movie-player">
                <div className="movie-player-wrap">
                    <div
                        className="player-bg"
                        style={{
                            backgroundImage: `url(${generateImageUrl(media?.backdrop_path)})`,
                        }}
                    />
                    <div className="player">
                        {iframeLoading && (
                            <div className="loader">
                                <PuffLoader color="#EA2027" size={50} />
                            </div>
                        )}
                        {!iframeVisible ? (
                            <div
                                className="btn-play"
                                onClick={() => {
                                    setIframeLoading(true);
                                    setIframeVisible(true);
                                }}
                            >
                                <IoPlayOutline />
                            </div>
                        ) : (
                            <iframe
                                src={iframeSrc}
                                allow="autoplay; fullscreen"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    overflow: 'hidden',
                                    border: 'none',
                                }}
                                onLoad={() => setIframeLoading(false)}
                                title="Video Player"
                            />
                        )}
                    </div>
                </div>

                <div className="player-actions">
                    <div className="player-actions-initial">
                        <IoSettingsOutline />
                        <h4>Controls</h4>
                    </div>
                    <div>
                        <BookmarkBtn media={media} mediaType={mediaType} inDetailsPage />
                    </div>
                </div>
            </div>

            <div className="config">
                <div className="server">
                    <div className="server-wrapper">
                        <div className="media-cloud">
                            <span>Server 1</span>
                        </div>
                        <div className="media-cloud">
                            <span>Server 2</span>
                        </div>
                    </div>
                </div>
                {mediaType === 'tv' ? (
                    <div className="series-data">
                        {!loading ? (
                            <>
                                <div className="season">
                                    <div className="dropdown">
                                        <button
                                            className="btn dropdown-toggle"
                                            onClick={() => setShowMenu((prev) => !prev)}
                                        >
                                            {`Season ${currentSeason}`}
                                        </button>
                                        <div
                                            className="dropdown-menu"
                                            style={{
                                                display: showMenu ? 'block' : 'none',
                                            }}
                                        >
                                            {renderSeasonItems()}
                                        </div>
                                    </div>
                                </div>
                                <div className="season-episodes">{renderEpisodes()}</div>
                            </>
                        ) : (
                            <PuffLoader
                                color="#EA2027"
                                loading={loading}
                                size={55}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />
                        )}
                    </div>
                ) : (
                    <div className="no-data">
                        <div>
                            <span>Playing: {media?.name || media?.title}...</span>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Player;
