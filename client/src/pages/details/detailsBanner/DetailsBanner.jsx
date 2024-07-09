import { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { generateImageUrl } from "../../../utils/movieUtils.js";
import dayjs from "dayjs";
import axios from "axios";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import Genres from "../../../components/genres/Genres";
import Img from "../../../components/lazyLoadImage/Img.jsx";
import Player from "../../../components/player/Player.jsx";
import SkLoadingDetails from "../../../components/skeletonLoading/skLoadDetails/SkLoadingDetails.jsx";
import "./detailsBanner.css";

const DetailsBanner = ({ }) => {
    const { mediaType, id } = useParams();
    const [data, setData] = useState(null);
    const [crew, setCrew] = useState(null);
    const [loading, setLoading] = useState(false);

    const _genres = useMemo(() => data?.genres?.map((g) => g.id), [data?.genres]);
    const director = useMemo(() => crew?.filter((f) => f.job === "Director") || [], [crew]);
    const writer = useMemo(
        () => crew?.filter((f) => ["Screenplay", "Story", "Writer"].includes(f.job)) || [],
        [crew]
    );

    const fetchMediaDetails = async () => {
        try {
            setLoading(true);
            const [mediaResponse, crewResponse] = await axios.all([
                axios.get(`/media/details?id=${id}&mediaType=${mediaType}`),
                axios.get(`/media/crew?id=${id}&mediaType=${mediaType}`),
            ]);

            setData(mediaResponse.data);
            setCrew(crewResponse.data.crew);
        } catch (error) {
            console.error("Error fetching data from the backend:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMediaDetails();
    }, []);

    const toHoursAndMinutes = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
    };

    const renderCrewInfo = (label, crewArray) =>
        crewArray?.length > 0 && (
            <div className="info">
                <span className="text bold">{`${label}: `}</span>
                <span className="text">
                    {crewArray.map((person, index) => (
                        <span key={index}>
                            {person.name}
                            {index !== crewArray.length - 1 && ", "}
                        </span>
                    ))}
                </span>
            </div>
        );

    return (
        <div className="detailsBanner">
            {!loading ? (
                <>
                    <div className="backdrop-img">
                        <Img src={generateImageUrl(data?.backdrop_path)} />
                    </div>
                    <div className="opacity-layer"></div>
                    <ContentWrapper>
                        <div className="content">
                            <div className="main">
                                <Player media={data} />
                            </div>

                            <div className="detailSection">
                                <div className="media-image">
                                    <Img src={generateImageUrl(data?.poster_path)} />
                                </div>
                                <div className="media-info">
                                    <div className="title">
                                        {`${data?.name || data?.title} (${dayjs(
                                            data?.release_date || data?.first_air_date
                                        ).format("YYYY")})`}
                                    </div>
                                    <div className="subtitle">{data?.tagline}</div>

                                    <Genres data={_genres} />

                                    <div className="overview">
                                        <div className="heading">Overview</div>
                                        <div className="description">{data?.overview}</div>
                                    </div>

                                    <div className="info">
                                        <span className="infoItem">Rating: </span>
                                        <span className="infoItem">
                                            {data?.vote_average.toFixed(1)}
                                        </span>
                                    </div>

                                    <div className="info" id="info-2">
                                        {data?.status && (
                                            <div className="infoItem">
                                                <span className="text bold">Status: </span>
                                                <span className="text">{data?.status}</span>
                                            </div>
                                        )}
                                        <div className="infoItem">
                                            <span className="text bold">Release Date: </span>
                                            <span className="text">
                                                {dayjs(
                                                    data?.release_date || data?.first_air_date
                                                ).format("MMM D, YYYY")}
                                            </span>
                                        </div>
                                        {data?.runtime && (
                                            <div className="infoItem">
                                                <span className="text bold">Runtime: </span>
                                                <span className="text">
                                                    {toHoursAndMinutes(data?.runtime)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {renderCrewInfo("Director", director)}
                                    {renderCrewInfo("Writer", writer)}
                                    {renderCrewInfo("Creator", data?.created_by)}
                                </div>
                            </div>
                        </div>
                    </ContentWrapper>
                </>
            ) : (
                <div className="content sk">
                    <SkLoadingDetails />
                </div>
            )}
        </div>
    );
};

export default DetailsBanner;
