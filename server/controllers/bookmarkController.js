import Bookmark from "../models/bookmarkModel.js";

const fetchBookmarks = async (req, res) => {
    const userId = req.userId;

    try {
        const bookmarks = await Bookmark.find({ userId });
        res.status(200).json(bookmarks);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const addBookmark = async (req, res) => {
    const userId = req.userId;
    const { mediaId, mediaType } = req.body;

    if (!userId) return res.status(400).json({ message: "Please login to use this feature" });

    if (!mediaId || !mediaType) return res.status(400).json({ message: "Error adding bookmark" });

    try {
        const existingBookmark = await Bookmark.findOne({ userId, mediaId, mediaType });

        if (existingBookmark) return res.status(200).json({ message: "Already bookmarked" });

        const bookmark = new Bookmark({ userId, mediaId, mediaType });

        await bookmark.save();
        res.status(200).json({ message: "Bookmark added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const removeBookmark = async (req, res) => {
    const userId = req.userId;
    const { mediaId, mediaType } = req.body;

    try {
        await Bookmark.deleteOne({ userId, mediaId, mediaType });
        res.status(200).json({ message: "Removed from bookmarks" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export { fetchBookmarks, addBookmark, removeBookmark };
