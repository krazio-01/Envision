import UserActivity from '../models/UserActivityModel.js';
import { generateMovieSuggestions } from '../services/ai.service.js';
import { tmdbApi } from '../utils/tmdbClient.js';

const getMediaTitlesFromIds = async (mediaItems) => {
    if (!mediaItems || mediaItems.length === 0) return [];

    const titles = await Promise.all(
        mediaItems.map((item) =>
            tmdbApi
                .get(`/${item.mediaType}/${item.mediaId}`)
                .then((response) => response.data.title || response.data.name)
                .catch((error) => {
                    console.error(`TMDB fetch failed for ${item.mediaId}:`, error.message);
                    return null;
                }),
        ),
    );

    return titles.filter(Boolean);
};

export const getPersonalizedRecommendations = async (req, res) => {
    try {
        const { prompt: userPrompt } = req.body;
        const userId = req.userId;

        let userProfile = {
            bookmarks: [],
            completed: [],
            abandoned: [],
        };

        if (userId) {
            const activity = await UserActivity.findOne({ userId }).lean();

            if (activity) {
                const [bookmarks, completed, abandoned] = await Promise.all([
                    getMediaTitlesFromIds(activity.bookmarks),
                    getMediaTitlesFromIds(activity.completed),
                    getMediaTitlesFromIds(activity.dropped),
                ]);

                userProfile.bookmarks = bookmarks;
                userProfile.completed = completed;
                userProfile.abandoned = abandoned;
            }
        }

        const hasHistory = userProfile.bookmarks.length > 0 || userProfile.completed.length > 0;

        if (!userPrompt?.trim() && !hasHistory) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a search prompt or log in to use your history for suggestions.',
            });
        }

        const aiRecommendations = await generateMovieSuggestions(userProfile, userPrompt);

        const enrichedRecommendations = await Promise.all(
            aiRecommendations.map(async (recommendation) => {
                const { mediaType, tmdbId, title, reason } = recommendation;
                let tmdbData = null;

                try {
                    if (tmdbId) {
                        try {
                            const { data } = await tmdbApi.get(`/${mediaType}/${tmdbId}`);
                            tmdbData = { ...data, media_type: mediaType };
                        } catch (idErr) {
                            console.log(`TMDB ID fetch failed for ${title}. Falling back to search...`);
                        }
                    }

                    if (!tmdbData) {
                        const { data } = await tmdbApi.get(`/search/multi?query=${encodeURIComponent(title)}`);

                        const results = data?.results || [];
                        tmdbData = results.find((item) => item.media_type === mediaType) || results[0];
                    }

                    return tmdbData ? { ...tmdbData, reason } : null;
                } catch (error) {
                    console.error(`Failed to enrich data for ${title}:`, error.message);
                    return null;
                }
            }),
        );

        const finalData = enrichedRecommendations.filter(Boolean);

        return res.status(200).json({ success: true, data: finalData });
    } catch (error) {
        console.error('Recommendations Controller Error:', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch recommendations.' });
    }
};
