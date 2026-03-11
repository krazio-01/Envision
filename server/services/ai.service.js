import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const responseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: 'The official title of the movie or TV show.' },
            mediaType: {
                type: Type.STRING,
                enum: ['movie', 'tv'],
                description: "Strictly use 'movie' for films and 'tv' for television shows.",
            },
            reason: {
                type: Type.STRING,
                description:
                    "A short, engaging, 1 line sentence pitch on why this perfectly matches the user's vibe and taste profile.",
            },
            tmdbId: { type: Type.INTEGER, description: 'The official TMDB ID for this media, if known.' },
        },
        required: ['title', 'mediaType', 'reason'],
    },
};

export const generateMovieSuggestions = async (userProfile = {}, userPrompt = '') => {
    const { bookmarks = [], completed = [], abandoned = [] } = userProfile;

    const promptParts = [
        `You are an elite streaming platform recommendation engine. Your goal is to suggest exactly 4 highly accurate titles to watch next.\n`,

        `### USER TASTE PROFILE:`,
        bookmarks.length > 0 && `- **All-Time Favorites (Bookmarks):** ${bookmarks.join(', ')}.`,
        completed.length > 0 && `- **Recently Completed:** ${completed.join(', ')}.`,
        abandoned.length > 0 &&
        `- **Abandoned/Dropped:** ${abandoned.join(', ')}. (CRITICAL: Do not recommend these, and avoid media with similar pacing, flaws, or themes).\n`,

        `### INSTRUCTIONS:`,
        `1. Analyze the taste profile to determine their preferred genres, pacing, and tones.`,
        `2. CRITICAL: Do NOT recommend any titles already listed in their Favorites, Completed, or Abandoned lists. Suggest entirely new media.`,

        userPrompt
            ? `3. The user has specifically requested this vibe for right now: "${userPrompt}". Prioritize this vibe while utilizing their Taste Profile (leaning into what they like, and avoiding what they dropped).`
            : `3. The user did not provide a specific vibe. Recommend hidden gems or highly acclaimed titles that perfectly align with their overall Taste Profile, while strictly avoiding the pacing, flaws, or themes of their abandoned titles.`,
    ];

    const promptContext = promptParts.filter(Boolean).join('\n');

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptContext,
        config: {
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
            temperature: 0.7,
        },
    });

    return JSON.parse(response.text);
};
