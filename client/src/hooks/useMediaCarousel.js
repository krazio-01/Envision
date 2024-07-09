import { useState, useEffect } from "react";
import axios from "axios";

const useMediaCarousel = (initialEndpoint, listType) => {
    const [endpoint, setEndpoint] = useState(initialEndpoint);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchMedia = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `/${endpoint}/list?listType=${listType}`
            );
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, [endpoint, listType]);

    const onTabChange = (tab) => {
        setEndpoint(tab === "Movies" ? "movie" : "tv");
    };

    return { data, loading, endpoint, onTabChange };
};

export default useMediaCarousel;
