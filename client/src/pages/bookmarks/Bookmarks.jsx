import { useState, useEffect } from "react";
import axios from "axios";
import { PuffLoader } from "react-spinners";
import MediaCard from "../../components/content/mediaCard/MediaCard";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import "./bookmarks.css";

const Bookmarks = () => {
    const [loading, setLoading] = useState(false);
    const [bookmarks, setBookmarks] = useState([]);
    const [media, setMedia] = useState([]);
    const [isRemoved, setIsRemoved] = useState(false);

    const fetchBookmarks = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/bookmark/fetchBookmarks", {
                withCredentials: true,
            });
            setBookmarks(data);
            return data;
        } catch (error) {
            console.error("Error fetching bookmarks:", error);
            return [];
        }
    };

    const fetchMediaDetails = async (bookmarks) => {
        try {
            const mediaDetailsPromises = bookmarks.map((bookmark) =>
                axios
                    .get(`/media/details?id=${bookmark.mediaId}&mediaType=${bookmark.mediaType}`, {
                        withCredentials: true,
                    })
                    .then((response) => response.data)
            );

            const mediaDetails = await Promise.all(mediaDetailsPromises);
            setMedia(mediaDetails);
        } catch (error) {
            console.error("Error fetching media details:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const bookmarksData = await fetchBookmarks();
            await fetchMediaDetails(bookmarksData);
            setLoading(false);
        };

        fetchData();
    }, [isRemoved]);

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
