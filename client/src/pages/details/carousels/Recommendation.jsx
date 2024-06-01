import React, { useState, useEffect } from "react";
import axios from "axios";
import Carousel from "../../../components/carousel/Carousel";

const Recommendation = ({ mediaType, id }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    const fetchRecommendation = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/${mediaType}/recommend?id=${id}`);
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommendation();
    }, []);

    return (
        <>
            {data?.results.length > 0 ? (
                <Carousel
                    title="Recommendations"
                    data={data?.results}
                    loading={loading}
                    endpoint={mediaType}
                />
            ) : (
                <div>
                    <span>No recommendations available.</span>
                </div>
            )}
        </>
    );
};

export default Recommendation;