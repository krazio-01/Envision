import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Carousel from "../../../components/carousel/Carousel";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import SwitchTabs from "../../../components/Ui/switchTabs/SwitchTabs";
import "../home.css";

const Trending = () => {
    const [endpoint, setEndpoint] = useState("day");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchTrendingMedia = async (endpoint) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `/movie/list?listType=trending&timeWindow=${endpoint}`
            );
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrendingMedia(endpoint);
    }, [endpoint]);

    const onTabChange = useCallback((tab) => {
        setEndpoint(tab === "Day" ? "day" : "week");
    }, []);

    return (
        <div className="carouselSection">
            <ContentWrapper>
                <span className="carouselTitle">Trending</span>
                <SwitchTabs data={["Day", "Week"]} onTabChange={onTabChange} />
            </ContentWrapper>

            <Carousel data={data?.results} loading={loading} endpoint={"movie"} />
        </div>
    );
};

export default Trending;
