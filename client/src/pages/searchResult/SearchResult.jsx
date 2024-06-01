import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import "./searchResult.css";
import { fetchDataFromApi } from "../../utils/movieUtils";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import MediaCard from "../../components/content/mediaCard/MediaCard";
import { PuffLoader } from "react-spinners";

const SearchResult = () => {
    const [data, setData] = useState(null);
    const [pageNum, setPageNum] = useState(1);
    const [loading, setLoading] = useState(false);
    const { query } = useParams();

    const fetchInitialData = () => {
        setLoading(true);
        fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`).then(
            (res) => {
                setData(res);
                setPageNum((prev) => prev + 1);
                setLoading(false);
            }
        );
    };

    const fetchNextPageData = () => {
        fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`).then(
            (res) => {
                // setLoading(true);
                if (data?.results)
                    setData({ ...data, results: [...data?.results, ...res.results] });
                else setData(res);
                setPageNum((prev) => prev + 1);
            }
        );
    };

    useEffect(() => {
        setPageNum(1);
        fetchInitialData();
    }, [query]);

    return (
        <div className="searchResultsPage">
            <ContentWrapper>
                <div className="searchResults">
                    {loading ? (
                        <div className="loadingOverlay">
                            <PuffLoader color="#EA2027" size={55} />
                        </div>
                    ) : data?.results?.length > 0 ? (
                        <>
                            <div className="pageTitle">
                                {`Search ${data?.total_results > 1 ? "results" : "result"
                                    } of '${query}'`}
                            </div>

                            <div className="results">
                                <InfiniteScroll
                                    className={`content ${data?.results?.length >= 7 ? "multiple-results" : ""
                                        }`}
                                    dataLength={data?.results?.length || []}
                                    next={fetchNextPageData}
                                    hasMore={pageNum <= data?.total_pages}
                                    loader={<PuffLoader color="#EA2027" size={55} />}
                                >
                                    {data?.results.map((item, index) => {
                                        if (item.media_type === "person") return null;
                                        return (
                                            <MediaCard
                                                key={index}
                                                item={item}
                                                endpoint={item.media_type}
                                            />
                                        );
                                    })}
                                </InfiniteScroll>
                            </div>
                        </>
                    ) : (
                        <span className="resultNotFound">{`Sorry, No Result Found For ${query} :(`}</span>
                    )}
                </div>
            </ContentWrapper>
        </div>
    );
};

export default SearchResult;
