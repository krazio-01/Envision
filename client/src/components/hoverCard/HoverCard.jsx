import dayjs from "dayjs";
import { FaStopwatch } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa";
import Genres from "../genres/Genres";
import BookmarkBtn from "../Ui/bookmarkBtn/BookmarkBtn";
import RemoveBtn from "../Ui/deleteBtn/RemoveBtn";
import "./hoverCard.css";

const HoverCard = ({ details, mediaType, showDeleteBtn, setIsRemoved }) => {
    const toHoursAndMinutes = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
    };

    return (
        <div className="additional-info">
            <div className="additional-info-wrapper">
                <div className="starting">
                    <span>{details?.name || details?.title}</span>
                    <Genres genres={details?.genres.slice(0, 2)} />
                    {details?.runtime && (
                        <span>
                            Duration: <FaStopwatch /> {toHoursAndMinutes(details?.runtime)}
                        </span>
                    )}
                    <span>
                        Release Date:{" "}
                        {dayjs(details?.release_date || details?.first_air_date).format(
                            "MMM D, YYYY"
                        )}
                    </span>
                    <span>
                        Score: <FaRegStar /> {details?.vote_average}
                    </span>
                </div>

                <div className="hovercard-action">
                    {showDeleteBtn ? (
                        <RemoveBtn
                            media={details}
                            mediaType={mediaType}
                            setIsRemoved={setIsRemoved}
                        />
                    ) : (
                        <BookmarkBtn
                            media={details}
                            mediaType={mediaType}
                            inHoverCard
                            inDetailsPage
                        />
                    )}
                </div>
            </div>

            <div className="overview">
                <div>
                    <span>Overview:</span>
                    <span>{details?.tagline}</span>
                    <span> {details?.overview}</span>
                </div>
            </div>
        </div>
    );
};

export default HoverCard;
