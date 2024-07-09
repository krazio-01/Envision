import { useState, useEffect } from "react";
import axios from "axios";
import Carousel from "../../../components/carousel/Carousel";

const Similar = ({ mediaType, id }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    const fetchSimilarMedia = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/media/similar?id=${id}&mediaType=${mediaType}`);
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSimilarMedia();
    }, []);

    const title = mediaType === "tv" ? "Similar TV Shows" : "Similar Movies";

    return <Carousel title={title} data={data?.results} loading={loading} endpoint={mediaType} />;
};

export default Similar;
