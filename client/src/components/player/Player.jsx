import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";
import { IoPlayOutline } from "react-icons/io5";
import { PuffLoader } from "react-spinners";
import "./player.css";

const Player = ({ url, media }) => {
    const { mediaType, id } = useParams();

    const [data, setData] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [episodeGroupExists, setEpisodeGroupExists] = useState(false);
    const [numberOfSeasons, setNumberOfSeasons] = useState(0);
    const [loading, setLoading] = useState(false);
    const [iframeVisible, setIframeVisible] = useState(false);
    const [iframeLoading, setIframeLoading] = useState(false);

    const navigate = useNavigate();

    const initialSeason =
        Number(
            (sessionStorage.getItem(`currentSeason_${id}`) || "").match(/\d+/)
        ) || 1;
    const initialEpisode =
        Number(
            (sessionStorage.getItem(`currentEpisode_${id}`) || "").match(/\d+/)
        ) || 1;

    const [currentSeason, setCurrentSeason] = useState(initialSeason);
    const [currentEpisode, setCurrentEpisode] = useState(initialEpisode);

    useEffect(() => {
        const fetchEpisodeGroups = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `/${mediaType}/episode_groups?id=${id}`
                );
                if (!response.data.results || response.data.results.length === 0)
                    return;

                const pick = response.data.results.reduce(
                    (prevItem, currentItem) =>
                        currentItem.group_count >= prevItem.group_count &&
                            currentItem.episode_count > prevItem.episode_count
                            ? currentItem
                            : prevItem,
                    response.data.results[0]
                );

                const groupInfo = await axios.get(
                    `/${mediaType}/group_info?groupId=${pick.id}`
                );
                setNumberOfSeasons(groupInfo.data.group_count);
                setData(groupInfo.data);
                setEpisodeGroupExists(true);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data from the backend:", error.message);
                setLoading(false);
            }
        };

        if (mediaType === "tv") fetchEpisodeGroups();
    }, []);

    useEffect(() => {
        sessionStorage.setItem(`currentSeason_${id}`, currentSeason);
        sessionStorage.setItem(`currentEpisode_${id}`, currentEpisode);
    }, [currentSeason, currentEpisode]);

    useEffect(() => {
        const fetchSeasonDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `/${mediaType}/season_details?id=${id}&seasonNo=${currentSeason}`
                );
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data from the backend:", error.message);
            }
        };

        if (!episodeGroupExists && mediaType === "tv") fetchSeasonDetails();
    }, [currentSeason]);

    const linkGenerator = (id) =>
        `https://vidsrc.to/embed/${mediaType}/${id}${mediaType === "tv" ? `/${currentSeason}/${currentEpisode}` : ""
        }`;

    const filteredSeasons = useMemo(
        () =>
            media?.seasons?.filter((season) => {
                const airDate = dayjs(season.air_date);
                return (
                    (!airDate.isAfter(dayjs()) && season.season_number !== 0) ||
                    airDate === null
                );
            }),
        [media?.seasons]
    );

    const handleEpSelect = (season, episodeIndex) => {
        setCurrentEpisode(episodeIndex + 1);
        navigate(
            `/${mediaType}/${media.name || media.title}/${id}/${season}/${episodeIndex + 1
            }`
        );
    };

    const renderSeasonItems = () => {
        const seasons = episodeGroupExists
            ? Array.from({ length: numberOfSeasons || 0 }, (_, index) => index + 1)
            : filteredSeasons?.map((season) => season.season_number) || [];
        return seasons.map((seasonNum, index) => (
            <a
                key={index}
                className={`dropdown-item ${currentSeason === seasonNum ? "active" : ""
                    }`}
                data-comment-id={`envision_${index}`}
                data-season={seasonNum}
                onClick={() => {
                    setShowMenu(false);
                    setCurrentSeason(seasonNum);
                }}
            >
                Season {seasonNum}
            </a>
        ));
    };

    const renderEpisodes = () => {
        const episodes = episodeGroupExists
            ? data?.groups[currentSeason - 1]?.episodes
            : data?.episodes;
        return episodes?.map((episode, episodeIndex) => (
            <div
                key={episodeIndex + 1}
                className="episode"
                onClick={() => handleEpSelect(currentSeason, episodeIndex)}
            >
                <a className={`${currentEpisode === episodeIndex + 1 ? "active" : ""}`}>
                    <span className="episode-num">Episode {episodeIndex + 1}</span>
                    <span className="episode-name">{episode.name}</span>
                </a>
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
                            backgroundImage: `url(${url.backdrop + media?.backdrop_path})`,
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
                                // src="https://vidplay.online/e/83P7891DVJLE?t=4xjQDfMnAVIMyQ%3D%3D&sub.info=https%3A%2F%2Fwatchseries.mx%2Fajax%2Fepisode%2Fsubtitles%2F337629&autostart=true"
                                src={linkGenerator(media?.id)}
                                allow="autoplay; fullscreen"
                                style={{ width: "100%", height: "100%", overflow: "hidden" }}
                                onLoad={() => setIframeLoading(false)}
                            />
                        )}
                    </div>
                </div>
            </div>
            <div className="config">
                <div className="server">
                    <div className="server-wrapper">
                        {/* https://filemoon.sx/e/k624t242f0cz?t=4xjQDfYvB1wKyA%3D%3D&ads=0&src=vidsrc */}
                        {/* https://vidplay.online/e/7ZPN660LZP02?sub.info=https%3A%2F%2Fvidsrc.to%2Fajax%2Fembed%2Fepisode%2FofJiP85r%2Fsubtitles&t=4xjQDfYvAFEOxQ%3D%3D&ads=0&src=vidsrc&autostart=true */}
                        <div className="media-cloud">
                            <span>Server 1</span>
                        </div>
                        <div className="media-cloud">
                            <span>Server 2</span>
                        </div>
                    </div>
                </div>
                {mediaType === "tv" ? (
                    <div className="series-data">
                        {!loading ? (
                            <>
                                <div className="season">
                                    <div className="dropdown">
                                        <button
                                            className="btn dropdown-toggle"
                                            onClick={() => setShowMenu(!showMenu)}
                                        >
                                            {`Season ${currentSeason}`}
                                        </button>
                                        <div
                                            className="dropdown-menu"
                                            style={{ display: showMenu ? "block" : "none" }}
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
