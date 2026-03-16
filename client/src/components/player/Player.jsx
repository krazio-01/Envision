import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import { IoPlayOutline, IoSettingsOutline } from 'react-icons/io5';
import { PuffLoader } from 'react-spinners';
import { generateImageUrl } from '../../utils/movieUtils';
import BookmarkBtn from '../Ui/bookmarkBtn/BookmarkBtn';
import './player.css';

const Player = ({ media }) => {
    const { mediaType, id } = useParams();
    const navigate = useNavigate();

    const [playback, setPlayback] = useState(() => ({
        season: Number((sessionStorage.getItem(`currentSeason_${id}`) || '').match(/\d+/)) || 1,
        episode: Number((sessionStorage.getItem(`currentEpisode_${id}`) || '').match(/\d+/)) || 1,
    }));
    const [mediaData, setMediaData] = useState({
        data: null,
        episodeGroupExists: false,
        numberOfSeasons: 0,
        loading: false,
    });
    const [ui, setUi] = useState({
        showMenu: false,
        iframeVisible: false,
        iframeLoading: false,
    });

    const updatePlayback = useCallback((updates) => setPlayback((prev) => ({ ...prev, ...updates })), []);
    const updateMediaData = useCallback((updates) => setMediaData((prev) => ({ ...prev, ...updates })), []);
    const updateUi = useCallback((updates) => setUi((prev) => ({ ...prev, ...updates })), []);

    const sessionStartTime = useRef(null);
    const totalWatchTimeMs = useRef(0);
    const hasSentData = useRef(false);
    const currentMediaRef = useRef({ id, mediaType });

    useEffect(() => {
        currentMediaRef.current = { id, mediaType };
    }, [id, mediaType]);

    const evaluateAndSendProgress = useCallback(async () => {
        if (hasSentData.current) return;

        let finalTimeMs = totalWatchTimeMs.current;
        if (sessionStartTime.current) finalTimeMs += Date.now() - sessionStartTime.current;

        const timeSpentMinutes = finalTimeMs / 1000 / 60;
        if (timeSpentMinutes < 3) return;

        hasSentData.current = true;
        const { id: currentId, mediaType: currentMediaType } = currentMediaRef.current;
        const estimatedThreshold = currentMediaType === 'tv' ? 35 : 100;
        const endpoint = timeSpentMinutes >= estimatedThreshold ? '/activity/markCompleted' : '/activity/markDropped';

        try {
            await axios.post(
                endpoint,
                {
                    mediaId: currentId,
                    mediaType: currentMediaType,
                },
                { withCredentials: true },
            );
        } catch (err) {
            console.error('Failed to save progress', err);
        }
    }, []);

    useEffect(() => {
        updateUi({ iframeVisible: false, iframeLoading: false, showMenu: false });
    }, [id, playback.season, playback.episode, updateUi]);

    useEffect(() => {
        if (ui.iframeVisible) {
            sessionStartTime.current = Date.now();
            totalWatchTimeMs.current = 0;
            hasSentData.current = false;
        } else sessionStartTime.current = null;
    }, [ui.iframeVisible]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && sessionStartTime.current) {
                totalWatchTimeMs.current += Date.now() - sessionStartTime.current;
                sessionStartTime.current = null;
            } else if (!document.hidden && ui.iframeVisible) sessionStartTime.current = Date.now();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [ui.iframeVisible]);

    useEffect(() => {
        const handleBeforeUnload = () => evaluateAndSendProgress();
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            evaluateAndSendProgress();
        };
    }, [id, playback.season, playback.episode, evaluateAndSendProgress]);

    useEffect(() => {
        if (mediaType !== 'tv') return;
        const abortController = new AbortController();

        const fetchEpisodeGroups = async () => {
            try {
                updateMediaData({ loading: true });
                const response = await axios.get(`/${mediaType}/episode_groups?id=${id}`, {
                    signal: abortController.signal,
                });

                if (!response.data.results?.length) {
                    updateMediaData({ loading: false });
                    return;
                }

                const pick = response.data.results.reduce(
                    (prev, current) =>
                        current.group_count >= prev.group_count && current.episode_count > prev.episode_count
                            ? current
                            : prev,
                    response.data.results[0],
                );

                const groupInfo = await axios.get(`/${mediaType}/group_info?groupId=${pick.id}`, {
                    signal: abortController.signal,
                });

                updateMediaData({
                    numberOfSeasons: groupInfo.data.group_count,
                    data: groupInfo.data,
                    episodeGroupExists: true,
                    loading: false,
                });
            } catch (error) {
                if (!axios.isCancel(error)) {
                    console.error('Error fetching episode groups:', error.message);
                    updateMediaData({ loading: false });
                }
            }
        };

        fetchEpisodeGroups();
        return () => abortController.abort();
    }, [mediaType, id, updateMediaData]);

    useEffect(() => {
        sessionStorage.setItem(`currentSeason_${id}`, playback.season);
        sessionStorage.setItem(`currentEpisode_${id}`, playback.episode);
    }, [playback.season, playback.episode, id]);

    useEffect(() => {
        if (mediaData.episodeGroupExists || mediaType !== 'tv') return;
        const abortController = new AbortController();

        const fetchSeasonDetails = async () => {
            try {
                updateMediaData({ loading: true });
                const response = await axios.get(`/${mediaType}/season_details?id=${id}&seasonNo=${playback.season}`, {
                    signal: abortController.signal,
                });
                updateMediaData({ data: response.data, loading: false });
            } catch (error) {
                if (!axios.isCancel(error)) {
                    console.error('Error fetching season details:', error.message);
                    updateMediaData({ loading: false });
                }
            }
        };

        fetchSeasonDetails();
        return () => abortController.abort();
    }, [playback.season, mediaData.episodeGroupExists, mediaType, id, updateMediaData]);

    const iframeSrc = useMemo(
        () =>
            `https://vidsrcme.su/embed/${mediaType}/${id}${mediaType === 'tv' ? `/${playback.season}/${playback.episode}` : ''}`,
        [mediaType, id, playback.season, playback.episode],
    );

    const filteredSeasons = useMemo(() => {
        return media?.seasons?.filter((season) => {
            const airDate = dayjs(season.air_date);
            return (!airDate.isAfter(dayjs()) && season.season_number !== 0) || !season.air_date;
        });
    }, [media?.seasons]);

    const handleEpSelect = useCallback(
        (season, episodeIndex) => {
            const selectedEpisode = episodeIndex + 1;
            updatePlayback({ episode: selectedEpisode });
            navigate(`/${mediaType}/${media?.name || media?.title}/${id}/${season}/${selectedEpisode}`);
        },
        [navigate, mediaType, media?.name, media?.title, id, updatePlayback],
    );

    const handleSeasonSelect = useCallback(
        (seasonNum) => {
            updateUi({ showMenu: false });
            updatePlayback({ season: seasonNum, episode: 1 });
            navigate(`/${mediaType}/${media?.name || media?.title}/${id}/${seasonNum}/1`);
        },
        [navigate, mediaType, media?.name, media?.title, id, updateUi, updatePlayback],
    );

    const renderedSeasonItems = useMemo(() => {
        const seasons = mediaData.episodeGroupExists
            ? Array.from({ length: mediaData.numberOfSeasons || 0 }, (_, i) => i + 1)
            : filteredSeasons?.map((s) => s.season_number) || [];

        return seasons.map((seasonNum, index) => (
            <button
                key={index}
                type="button"
                className={`dropdown-item ${playback.season === seasonNum ? 'active' : ''}`}
                data-season={seasonNum}
                onClick={() => handleSeasonSelect(seasonNum)}
                style={{ textAlign: 'left' }}
            >
                Season {seasonNum}
            </button>
        ));
    }, [mediaData.episodeGroupExists, mediaData.numberOfSeasons, filteredSeasons, playback.season, handleSeasonSelect]);

    const renderedEpisodes = useMemo(() => {
        const episodes = mediaData.episodeGroupExists
            ? mediaData.data?.groups?.[playback.season - 1]?.episodes
            : mediaData.data?.episodes;

        return episodes?.map((episode, episodeIndex) => (
            <div
                key={episodeIndex + 1}
                className="episode"
                onClick={() => handleEpSelect(playback.season, episodeIndex)}
                style={{ cursor: 'pointer' }}
            >
                <div className={`${playback.episode === episodeIndex + 1 ? 'active' : ''}`}>
                    <span className="episode-num">Episode {episodeIndex + 1}</span>
                    <span className="episode-name">{episode.name}</span>
                </div>
            </div>
        ));
    }, [mediaData.episodeGroupExists, mediaData.data, playback.season, playback.episode, handleEpSelect]);

    return (
        <>
            <div className="movie-player">
                <div className="movie-player-wrap">
                    <div
                        className="player-bg"
                        style={{ backgroundImage: `url(${generateImageUrl(media?.backdrop_path)})` }}
                    />
                    <div className="player">
                        {ui.iframeLoading && (
                            <div className="loader">
                                <PuffLoader color="#EA2027" size={50} />
                            </div>
                        )}
                        {!ui.iframeVisible ? (
                            <div
                                className="btn-play"
                                onClick={() => updateUi({ iframeLoading: true, iframeVisible: true })}
                            >
                                <IoPlayOutline />
                            </div>
                        ) : (
                            <iframe
                                src={iframeSrc}
                                allow="autoplay; fullscreen"
                                style={{ width: '100%', height: '100%', overflow: 'hidden', border: 'none' }}
                                onLoad={() => updateUi({ iframeLoading: false })}
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
                        {!mediaData.loading ? (
                            <>
                                <div className="season">
                                    <div className="dropdown">
                                        <button
                                            className="btn dropdown-toggle"
                                            onClick={() => updateUi({ showMenu: !ui.showMenu })}
                                        >
                                            {`Season ${playback.season}`}
                                        </button>
                                        <div
                                            className="dropdown-menu"
                                            style={{ display: ui.showMenu ? 'block' : 'none' }}
                                        >
                                            {renderedSeasonItems}
                                        </div>
                                    </div>
                                </div>
                                <div className="season-episodes">{renderedEpisodes}</div>
                            </>
                        ) : (
                            <PuffLoader
                                color="#EA2027"
                                loading={mediaData.loading}
                                size={55}
                                aria-label="Loading Spinner"
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
