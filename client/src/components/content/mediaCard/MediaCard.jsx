import React, { useState, useMemo, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import axios from "axios";
import { PuffLoader } from "react-spinners";
import HoverCard from "../../hoverCard/HoverCard";
import Img from "../../lazyLoadImage/Img";
import PosterFallback from "../../../assets/images/no-poster.jpg";
import "./mediaCard.css";

const EDGE_THRESHOLD = 40;

const MediaCard = ({ item, endpoint }) => {
    const { url } = useSelector((state) => state.home);
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [containerStyle, setContainerStyle] = useState({
        left: "var(--edge-offset)",
    });

    const navigate = useNavigate();
    const containerRef = useRef();

    const {
        id,
        media_type,
        name,
        title,
        poster_path,
        release_date,
        first_air_date,
    } = item;

    const initialSeason = getInitialValue(`currentSeason_${id}`, 1);
    const initialEpisode = getInitialValue(`currentEpisode_${id}`, 1);

    const posterUrl = useMemo(
        () => (poster_path ? url.poster + poster_path : PosterFallback),
        [poster_path, url.poster]
    );

    const date = dayjs(endpoint === "movie" ? release_date : first_air_date);
    const formattedDate = date.format("YYYY");

    const handleMouseEnter = async () => {
        const container = containerRef.current;
        if (container) {
            const rect = container.getBoundingClientRect();
            const isNearRightEdge = rect.right >= window.innerWidth - EDGE_THRESHOLD;
            const isNearLeftEdge = rect.left <= EDGE_THRESHOLD;

            setContainerStyle((prevStyle) => {
                if (isNearRightEdge) return { right: "var(--edge-offset)" };
                else if (isNearLeftEdge) return { left: "var(--edge-offset)" };
                else return prevStyle;
            });

            try {
                const { data } = await axios.get(`/${endpoint}/details?id=${id}`);
                setDetails(data);
            } catch (error) {
                console.error("Error fetching details:", error);
            }
            finally {
                setLoading(false);
            }
        }
    };

    return (
        <Link
            className="media-item"
            to={`/${media_type || endpoint}/${name || title}/${id}/${initialSeason}/${initialEpisode}`}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            onMouseEnter={handleMouseEnter}
        >
            <div className="posterBlock">
                <Img src={posterUrl} />
            </div>
            <div className="textBlock">
                <span className="title">{name || title}</span>
                <div className="misc">
                    <span>{endpoint === "movie" ? "Movie" : "TV Show"}</span>
                    <span>{formattedDate}</span>
                </div>
            </div>
            <div className="info-container" style={containerStyle} ref={containerRef}>
                {loading ? (
                    <div className="loader">
                        <PuffLoader color="#EA2027" loading={loading} size={35} />
                    </div>
                ) : (
                    <HoverCard details={details} />
                )}
            </div>
        </Link>
    );
};

export default MediaCard;

function getInitialValue(key, defaultValue) {
    return (
        Number((sessionStorage.getItem(key) || "").match(/\d+/)) || defaultValue
    );
}
