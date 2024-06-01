import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Carousel from "../../../components/carousel/Carousel";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import SwitchTabs from "../../../components/switchTabs/SwitchTabs";
import "../home.css";

const TopRated = () => {
    const [endpoint, setEndpoint] = useState("movie");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchTopRatedMedia = async (endpoint) => {
        try {
            setLoading(true);
            const response = await axios.get(`/${endpoint}/list?listType=top_rated`);
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopRatedMedia(endpoint);
    }, [endpoint]);

    const onTabChange = (tab) => {
        setEndpoint(tab === "Movies" ? "movie" : "tv");
    };

    return (
        <div className="carouselSection">
            <ContentWrapper>
                <span className="carouselTitle">Top Rated</span>
                <SwitchTabs data={["Movies", "Tv Shows"]} onTabChange={onTabChange} />
            </ContentWrapper>

            <Carousel data={data?.results} loading={loading} endpoint={endpoint} />
        </div>
    );
};

export default TopRated;