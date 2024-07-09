import { useState } from "react";
import useToast from "../../../hooks/useToast";
import useUserStore from "../../../store/store";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";
import "./bookmarkBtn.css";

const BookmarkBtn = ({ media, mediaType, inDetailsPage = false, inHoverCard = false }) => {
    const [isBookmarked, setIsBookmarked] = useState(false);

    const toast = useToast();
    const user = useUserStore((state) => state.user);

    const handleBookmark = async () => {
        if (!user) {
            toast("error", "Please login to use this feature");
            return;
        }

        try {
            const { data } = await axios.post(
                "/bookmark/addBookmark",
                { mediaId: media.id, mediaType },
                { withCredentials: true }
            );
            setIsBookmarked(true);
            toast("success", data.message);
        } catch (error) {
            toast("error", error.response?.data?.message);
        }
    };

    return (
        <div className="bookmark">
            <button
                className={inDetailsPage ? "basic" : "action-btn"}
                onClick={handleBookmark}
            >
                {isBookmarked ? <FaHeart /> : <FaRegHeart />}
                {!inHoverCard && <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>}
            </button>
        </div>
    );
};

export default BookmarkBtn;
