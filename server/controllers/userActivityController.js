import UserActivity from '../models/UserActivityModel.js';

const fetchBookmarks = async (req, res) => {
    const userId = req.userId;

    try {
        const activity = await UserActivity.findOne({ userId });
        res.status(200).json(activity ? activity.bookmarks : []);
    } catch (error) {
        console.error('Fetch Bookmarks Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const addBookmark = async (req, res) => {
    const userId = req.userId;
    const { mediaId, mediaType } = req.body;

    if (!userId) return res.status(400).json({ message: 'Please login to use this feature' });
    if (!mediaId || !mediaType) return res.status(400).json({ message: 'Error adding bookmark' });

    try {
        await UserActivity.findOneAndUpdate({ userId }, { $pull: { bookmarks: { mediaId: String(mediaId) } } });

        await UserActivity.findOneAndUpdate(
            { userId },
            {
                $push: {
                    bookmarks: {
                        $each: [{ mediaId: String(mediaId), mediaType }],
                        $position: 0,
                        $slice: 100,
                    },
                },
            },
            { upsert: true, new: true },
        );

        res.status(200).json({ message: 'Bookmark added successfully' });
    } catch (error) {
        console.error('Add Bookmark Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const removeBookmark = async (req, res) => {
    const userId = req.userId;
    const { mediaId } = req.body;

    try {
        await UserActivity.findOneAndUpdate(
            { userId },
            {
                $pull: {
                    bookmarks: { mediaId: String(mediaId) },
                },
            },
        );
        res.status(200).json({ message: 'Removed from bookmarks' });
    } catch (error) {
        console.error('Remove Bookmark Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const markAsCompleted = async (req, res) => {
    const userId = req.userId;
    const { mediaId, mediaType } = req.body;

    if (!userId || !mediaId || !mediaType) return res.status(400).json({ message: 'Invalid request data' });

    try {
        await UserActivity.findOneAndUpdate(
            { userId },
            {
                $pull: {
                    completed: { mediaId: String(mediaId) },
                    dropped: { mediaId: String(mediaId) }
                }
            }
        );

        await UserActivity.findOneAndUpdate(
            { userId },
            {
                $push: {
                    completed: {
                        $each: [{ mediaId: String(mediaId), mediaType }],
                        $position: 0,
                        $slice: 50,
                    },
                },
            },
            { upsert: true },
        );

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const markAsDropped = async (req, res) => {
    const userId = req.userId;
    const { mediaId, mediaType } = req.body;

    if (!userId || !mediaId || !mediaType) return res.status(400).json({ message: 'Invalid request data' });

    try {
        await UserActivity.findOneAndUpdate(
            { userId },
            {
                $pull: {
                    dropped: { mediaId: String(mediaId) },
                    completed: { mediaId: String(mediaId) },
                },
            },
        );

        await UserActivity.findOneAndUpdate(
            { userId },
            {
                $push: {
                    dropped: {
                        $each: [{ mediaId: String(mediaId), mediaType }],
                        $position: 0,
                        $slice: 30,
                    },
                },
            },
            { upsert: true },
        );

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export { fetchBookmarks, addBookmark, removeBookmark, markAsCompleted, markAsDropped };
