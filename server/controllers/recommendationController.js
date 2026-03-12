import UserActivity from '../models/UserActivityModel.js';
import { generateMovieSuggestions } from '../services/ai.service.js';
import { tmdbApi } from '../utils/tmdbClient.js';

const getMediaTitlesFromIds = async (mediaItems) => {
    try {
        const titles = await Promise.all(
            mediaItems.map(async (item) => {
                const response = await tmdbApi.get(`/${item.mediaType}/${item.mediaId}`);
                return response.data.title || response.data.name;
            }),
        );
        return titles.filter(Boolean);
    } catch (error) {
        console.error('Error fetching media titles from TMDB:', error.message);
        return [];
    }
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
            const activity = await UserActivity.findOne({ userId });

            if (activity) {
                if (activity.bookmarks.length > 0)
                    userProfile.bookmarks = await getMediaTitlesFromIds(activity.bookmarks);
                if (activity.completed.length > 0)
                    userProfile.completed = await getMediaTitlesFromIds(activity.completed);
                if (activity.dropped.length > 0) userProfile.abandoned = await getMediaTitlesFromIds(activity.dropped);
            }
        }

        // Require EITHER a logged-in user with history OR a prompt
        const hasHistory = userProfile.bookmarks.length > 0 || userProfile.completed.length > 0;
        if (!userId && (!userPrompt || userPrompt.trim() === '') && !hasHistory) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a search prompt or log in for recommendations.',
            });
        }

        // Pass the full profile to the AI
        const aiRecommendations = await generateMovieSuggestions(userProfile, userPrompt);

        // TMDB Enrichment Phase
        const enrichedRecommendations = await Promise.all(
            aiRecommendations.map(async (recommendation) => {
                try {
                    let tmdbData = null;
                    const mediaType = recommendation.mediaType;

                    if (recommendation.tmdbId) {
                        try {
                            const { data } = await tmdbApi.get(`/${mediaType}/${recommendation.tmdbId}`);
                            tmdbData = data;
                            tmdbData.media_type = mediaType;
                        } catch (idErr) {
                            console.log(`TMDB ID fetch failed for ${recommendation.title}. Falling back to search...`);
                        }
                    }

                    if (!tmdbData) {
                        const { data } = await tmdbApi.get(
                            `/search/multi?query=${encodeURIComponent(recommendation.title)}`,
                        );

                        if (data && data.results && data.results.length > 0)
                            tmdbData = data.results.find((item) => item.media_type === mediaType) || data.results[0];
                    }

                    if (tmdbData) {
                        return {
                            ...tmdbData,
                            reason: recommendation.reason,
                        };
                    }
                    return null;
                } catch (error) {
                    console.error(`Failed to enrich data for ${recommendation.title}:`, error.message);
                    return null;
                }
            }),
        );

        const finalData = enrichedRecommendations.filter((item) => item !== null);

        return res.status(200).json({ success: true, data: finalData });
    } catch (error) {
        console.error('Controller Error:', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch recommendations.' });
    }
};
