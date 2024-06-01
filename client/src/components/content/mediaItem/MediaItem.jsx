import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { BsBadgeHdFill } from "react-icons/bs";
import { FaRegStar } from "react-icons/fa";
import dayjs from 'dayjs';
import PosterFallback from "../../../assets/images/no-poster.jpg";
import './mediaItem.css';

const MediaItem = ({ suggestion, setShowSuggestion }) => {
    const { url } = useSelector((state) => state.home);
    const navigate = useNavigate();

    const handleClick = () => {
        window.scrollTo(0, 0);
        setShowSuggestion(false);
        navigate(`/${suggestion.media_type || endpoint}/${suggestion.original_name || suggestion.title}/${suggestion.id}/1/1`);
    };

    const itemUrl = suggestion.poster_path ? url.poster + suggestion.poster_path : PosterFallback;

    return (
        <div className="sugg">
            <div
                key={suggestion.id}
                className="suggestedItem"
                onClick={handleClick}
            >
                <div className="item-poster">
                    <div>
                        <img src={itemUrl} />
                    </div>
                </div>
                <div className="item-info">
                    <div className="item-name">{suggestion.name || suggestion.title}</div>
                    <div className="item-meta">
                        <span><BsBadgeHdFill /></span>
                        <span>
                            <FaRegStar />
                            {suggestion.vote_average}
                        </span>
                        <span>
                            {dayjs(suggestion.release_date || suggestion.first_air_date).format(
                                "MMM D, YYYY"
                            )}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default MediaItem
