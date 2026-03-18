import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/apiClient';
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import Select from 'react-select';
import { PuffLoader } from 'react-spinners';
import ContentWrapper from '../../components/contentWrapper/ContentWrapper';
import MediaCard from '../../components/content/mediaCard/MediaCard';
import './explore.css';

let filters = {};

const sortbyData = [
    { value: 'popularity.desc', label: 'Popularity Descending' },
    { value: 'popularity.asc', label: 'Popularity Ascending' },
    { value: 'vote_average.desc', label: 'Rating Descending' },
    { value: 'vote_average.asc', label: 'Rating Ascending' },
    { value: 'primary_release_date.desc', label: 'Release Date Descending' },
    { value: 'primary_release_date.asc', label: 'Release Date Ascending' },
    { value: 'original_title.asc', label: 'Title (A-Z)' },
];

const Explore = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pageNum, setPageNum] = useState(1);
    const [genres, setGenres] = useState([]);
    const [currentGenre, setCurrentGenre] = useState(null);
    const [sortby, setSortby] = useState(null);

    const { mediaType } = useParams();

    const fetchGenres = useCallback(async () => {
        try {
            const { data } = await apiClient.get(`/media/genres?mediaType=${mediaType}`);
            setGenres(data.genres);
        } catch (error) {
            console.error('error in fetchGenres: ', error);
        }
    }, [mediaType]);

    const fetchInitialData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(`/media/discover/?mediaType=${mediaType}`, {
                params: { page: 1, ...filters },
            });
            setData(response.data);
            setPageNum(2);
        } catch (error) {
            console.error('Error fetching data:', error.message);
        } finally {
            setLoading(false);
        }
    }, [mediaType]);

    const fetchNextPageData = useCallback(async () => {
        try {
            const response = await apiClient.get(`/media/discover/?mediaType=${mediaType}`, {
                params: { page: pageNum, ...filters },
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
    }, [mediaType, pageNum, data]);

    useEffect(() => {
        filters = {};
        setData(null);
        setPageNum(1);
        setSortby(null);
        setCurrentGenre(null);
        fetchGenres();
        fetchInitialData();
    }, [mediaType, fetchGenres, fetchInitialData]);

    const onChange = (selectedItems, action) => {
        if (action.name === 'sortby') {
            setSortby(selectedItems);
            if (action.action !== 'clear') filters.sort_by = selectedItems.value;
            else delete filters.sort_by;
        }

        if (action.name === 'genres') {
            setCurrentGenre(selectedItems);
            if (action.action !== 'clear') {
                let genreId = selectedItems.map((g) => g.id);
                genreId = JSON.stringify(genreId).slice(1, -1);
                filters.with_genres = genreId;
            } else delete filters.with_genres;
        }

        fetchInitialData();
    };

    return (
        <div className="explorePage">
            <ContentWrapper>
                <div className="pageHeader">
                    <div className="pageTitle">{mediaType === 'tv' ? 'Explore TV Shows' : 'Explore Movies'}</div>
                    <div className="filters">
                        <Select
                            isMulti
                            name="genres"
                            value={currentGenre}
                            closeMenuOnSelect={false}
                            options={genres}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id}
                            onChange={onChange}
                            placeholder="Select genres"
                            className="react-select-container genresDD"
                            classNamePrefix="react-select"
                        />
                        <Select
                            name="sortby"
                            value={sortby}
                            options={sortbyData}
                            onChange={onChange}
                            isClearable={true}
                            placeholder="Sort by"
                            className="react-select-container sortbyDD"
                            classNamePrefix="react-select"
                        />
                    </div>
                </div>

                <div className="filterResults">
                    {loading ? (
                        <div className="loadingOverlay">
                            <PuffLoader color="#EA2027" size={55} />
                        </div>
                    ) : data?.results?.length > 0 ? (
                        <InfiniteScroll
                            className="content"
                            dataLength={data?.results?.length || 0}
                            next={fetchNextPageData}
                            hasMore={pageNum <= data?.total_pages}
                            loader={<PuffLoader color="#EA2027" size={55} />}
                            style={{ overflow: 'hidden' }}
                        >
                            {data?.results?.map((item, index) => {
                                if (item.media_type === 'person') return null;
                                return <MediaCard key={index} item={item} endpoint={mediaType} />;
                            })}
                        </InfiniteScroll>
                    ) : (
                        <span className="resultNotFound">{`Sorry, No Results Found :(`}</span>
                    )}
                </div>
            </ContentWrapper>
        </div>
    );
};

export default Explore;
