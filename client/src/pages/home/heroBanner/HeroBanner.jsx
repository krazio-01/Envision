import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { BsBadgeHdFill } from 'react-icons/bs';
import { FaStopwatch, FaHeart, FaRegStar } from 'react-icons/fa';
import { IoPlayOutline } from "react-icons/io5";
import SkeletonLoadingBanner from '../../../components/skeletonLoading/skLoadBanner/SkLoadingBanner';
import './heroBanner.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const HeroBanner = () => {
    const [loading, setLoading] = useState(true);
    const [media, setMedia] = useState([]);

    const { url } = useSelector((state) => state.home);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPopularMovieDetails = async () => {
            try {
                const response = await axios.get(`/movie/list?listType=popular`);

                const detailsPromises = response.data.results
                    .slice(0, 7)
                    .map(async (item) => {
                        const response = await axios.get(`/movie/details?id=${item.id}`);
                        return response.data;
                    });

                Promise.all(detailsPromises)
                    .then((details) => {
                        setMedia(details);
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.error("Error fetching movie details:", error);
                        setLoading(false);
                    });
            } catch (error) {
                console.error("Error fetching data:", error);
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

    const handleNavigate = useCallback(
        (item) => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            navigate(`/movie/${item.original_name || item.title}/${item.id}/1/1`);
        },
        [navigate]
    );

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
                                backgroundImage: `url(${url.backdrop + movie.backdrop_path})`,
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
                                            <IoPlayOutline />
                                            <button onClick={() => handleNavigate(movie)}>
                                                Play{" "}
                                            </button>
                                        </div>
                                        <div>
                                            <FaHeart />
                                            <button>Bookmark</button>
                                        </div>
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
