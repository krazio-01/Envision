import React from "react";
import dayjs from "dayjs";
import { FaStopwatch } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa";
import Genres from "../genres/Genres";
import "./hoverCard.css";

const HoverCard = ({ details }) => {
    const toHoursAndMinutes = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
    };

    return (
        <div className="additional-info">
            <div className="starting">
                <span>{details?.name || details?.title}</span>
                <Genres data={details.genres.slice(0, 2).map((g) => g.id)} />
                {details?.runtime && (
                    <span>
                        Duration: <FaStopwatch /> {toHoursAndMinutes(details.runtime)}
                    </span>
                )}
                <span>
                    Release Date:{" "}
                    {dayjs(details.release_date || details.first_air_date).format(
                        "MMM D, YYYY"
                    )}
                </span>
                <span>
                    Score: <FaRegStar /> {details?.vote_average}
                </span>
            </div>
            
            <div className="overview">
                <div>
                    <span>Overview:</span>
                    <span>{details.tagline}</span>
                    <span> {details.overview}</span>
                </div>
            </div>
        </div>
    );
};

export default HoverCard;