import React, { useState, useEffect } from "react";
import axios from "axios";
import Carousel from "../../../components/carousel/Carousel";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import SwitchTabs from "../../../components/switchTabs/SwitchTabs";
import "../home.css";

const Popular = () => {
    const [endpoint, setEndpoint] = useState("movie");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchPopularMedia = async (endpoint) => {
        try {
            setLoading(true);
            const response = await axios.get(`/${endpoint}/list?listType=popular`);
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPopularMedia(endpoint);
    }, [endpoint]);

    const onTabChange = (tab) => {
        setEndpoint(tab === "Movies" ? "movie" : "tv");
    };

    return (
        <div className="carouselSection">
            <ContentWrapper>
                <span className="carouselTitle">What's Popular</span>
                <SwitchTabs data={["Movies", "Tv Shows"]} onTabChange={onTabChange} />
            </ContentWrapper>

            <Carousel data={data?.results} loading={loading} endpoint={endpoint} />
        </div>
    );
};

export default Popular;
