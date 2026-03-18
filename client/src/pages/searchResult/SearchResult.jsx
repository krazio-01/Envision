import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/apiClient';
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import ContentWrapper from '../../components/contentWrapper/ContentWrapper';
import MediaCard from '../../components/content/mediaCard/MediaCard';
import { PuffLoader } from 'react-spinners';
import './searchResult.css';

const SearchResult = () => {
    const [data, setData] = useState(null);
    const [pageNum, setPageNum] = useState(1);
    const [loading, setLoading] = useState(false);
    const { query } = useParams();

    const fetchInitialData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/multi/search', {
                params: { query, page: 1 },
            });
            setData(response.data);
            setPageNum(2);
        } catch (error) {
            console.error('Error fetching search results:', error.message);
        } finally {
            setLoading(false);
        }
    }, [query]);

    const fetchNextPageData = useCallback(async () => {
        try {
            const response = await apiClient.get('/multi/search', {
                params: { query, page: pageNum },
            });
            if (data?.results) {
                setData((prev) => ({
                    ...prev,
                    results: [...prev.results, ...response.data.results],
                }));
            } else {
                setData(response.data);
            }
            setPageNum((prev) => prev + 1);
        } catch (error) {
            console.error('Error fetching next page data:', error.message);
        }
    }, [query, pageNum, data]);

    useEffect(() => {
        setPageNum(1);
        fetchInitialData();
    }, [query, fetchInitialData]);

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
                                {`Search ${data?.total_results > 1 ? 'results' : 'result'} of '${query}'`}
                            </div>

                            <div className="results">
                                <InfiniteScroll
                                    className={`content ${data?.results?.length >= 7 ? 'multiple-results' : ''}`}
                                    dataLength={data?.results?.length || 0}
                                    next={fetchNextPageData}
                                    hasMore={pageNum <= data?.total_pages}
                                    loader={<PuffLoader color="#EA2027" size={55} />}
                                >
                                    {data?.results.map((item, index) => {
                                        if (item.media_type === 'person') return null;
                                        return <MediaCard key={index} item={item} endpoint={item.media_type} />;
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
