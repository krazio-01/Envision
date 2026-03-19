import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/apiClient';
import { PuffLoader } from 'react-spinners';
import MediaCard from '../../components/content/mediaCard/MediaCard';
import ContentWrapper from '../../components/contentWrapper/ContentWrapper';
import './bookmarks.css';

const Bookmarks = () => {
    const [loading, setLoading] = useState(false);
    const [bookmarks, setBookmarks] = useState([]);
    const [media, setMedia] = useState([]);
    const [isRemoved, setIsRemoved] = useState(false);

    const fetchBookmarks = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await apiClient.get('/activity/fetchBookmarks');
            setBookmarks(data);
            return data;
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
            return [];
        }
    }, []);

    const fetchMediaDetails = useCallback(async (bookmarksList) => {
        try {
            const mediaDetailsPromises = bookmarksList.map((bookmark) =>
                apiClient
                    .get(`/media/details?id=${bookmark.mediaId}&mediaType=${bookmark.mediaType}`)
                    .then((response) => response.data),
            );

            const mediaDetails = await Promise.all(mediaDetailsPromises);
            setMedia(mediaDetails);
        } catch (error) {
            console.error('Error fetching media details:', error);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const bookmarksData = await fetchBookmarks();
            await fetchMediaDetails(bookmarksData);
            setLoading(false);
        };

        fetchData();
    }, [isRemoved, fetchBookmarks, fetchMediaDetails]);

    return (
        <div className="bookmarks-main">
            {loading ? (
                <div className="loadingOverlay">
                    <PuffLoader color="#EA2027" size={55} />
                </div>
            ) : (
                <ContentWrapper>
                    {bookmarks.length === 0 ? (
                        <div className="noBookmarks">
                            <h3>No bookmarks found.</h3>
                        </div>
                    ) : (
                        <div className="bookmarks-results">
                            {bookmarks.map((bookmark, index) => (
                                <MediaCard
                                    key={index}
                                    item={media[index]}
                                    endpoint={bookmark.mediaType}
                                    setIsRemoved={setIsRemoved}
                                    showDeleteBtn
                                />
                            ))}
                        </div>
                    )}
                </ContentWrapper>
            )}
        </div>
    );
};

export default Bookmarks;
