import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { generateImageUrl } from "../../../utils/movieUtils";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import BookmarkBtn from "../../../components/Ui/bookmarkBtn/BookmarkBtn";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { BsBadgeHdFill } from "react-icons/bs";
import { FaStopwatch, FaRegStar } from "react-icons/fa";
import { IoPlayOutline } from "react-icons/io5";
import SkeletonLoadingBanner from "../../../components/skeletonLoading/skLoadBanner/SkLoadingBanner";
import "./heroBanner.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const HeroBanner = () => {
    const [loading, setLoading] = useState(true);
    const [media, setMedia] = useState([]);

    useEffect(() => {
        const fetchPopularMovieDetails = async () => {
            try {
                const { data } = await axios.get(`/movie/list?listType=popular`);

                const detailsPromises = data?.results.slice(0, 7).map(async (item) => {
                    const { data } = await axios.get(
                        `/media/details?id=${item.id}&mediaType=movie`
                    );
                    return data;
                });
                Promise.all(detailsPromises)
                    .then((details) => setMedia(details))
                    .catch((error) => console.error("Error fetching movie details:", error));
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPopularMovieDetails();
    }, []);

    const formatDuration = useCallback((minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}min`;
    }, []);

    return (
        <div className="heroBanner">
            {loading ? (
                <SkeletonLoadingBanner />
            ) : (
                <Swiper
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                        dynamicMainBullets: 3,
                    }}
                    modules={[Autoplay, Pagination, Navigation]}
                    navigation={true}
                    className="mySwiper"
                    autoplay={{ delay: 7000, disableOnInteraction: false }}
                >
                    {media?.map((movie, index) => (
                        <SwiperSlide
                            key={index}
                            style={{
                                backgroundImage: `url(${generateImageUrl(movie.backdrop_path)})`,
                            }}
                        >
                            <div className="wrapper">
                                <div className="bannerInfo">
                                    <div className="name">{movie.title}</div>
                                    <div className="meta">
                                        <span>
                                            <BsBadgeHdFill />
                                        </span>
                                        <span>
                                            <FaStopwatch />
                                            {formatDuration(movie.runtime)}
                                        </span>
                                        <span>
                                            <FaRegStar />
                                            {movie.vote_average}
                                        </span>
                                        <span>
                                            {movie.genres.map((genre) => (
                                                <span key={genre.id}>{genre.name}</span>
                                            ))}
                                        </span>
                                    </div>
                                    <div className="desc">{movie.overview}</div>
                                    <div className="action">
                                        <div>
                                            <Link
                                                className="action-link"
                                                to={`/movie/${movie.original_name || movie.title}/${
                                                    movie.id
                                                }/1/1`}
                                                onClick={() =>
                                                    window.scrollTo({ top: 0, behavior: "smooth" })
                                                }
                                            >
                                                <IoPlayOutline />
                                                <span>Play </span>
                                            </Link>
                                        </div>

                                        <BookmarkBtn media={movie} mediaType="movie" />
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
};

export default HeroBanner;
