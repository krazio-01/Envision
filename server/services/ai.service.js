import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const RESPONSE_SCHEMA = {
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

const SYSTEM_INSTRUCTION = `You are an elite streaming platform recommendation engine. Your goal is to suggest exactly 4 highly accurate titles to watch next.
### INSTRUCTIONS:
1. Analyze the user's taste profile to determine preferred genres, pacing, and tones.
2. CRITICAL: Do NOT recommend any titles already listed in their Favorites, Completed, or Abandoned lists. Suggest entirely new media.
3. If the user provides a specific vibe, prioritize it while utilizing their Taste Profile.
4. If no specific vibe is provided, recommend hidden gems or highly acclaimed titles aligning with their profile, strictly avoiding themes or pacing of their abandoned titles.`;

export const generateMovieSuggestions = async (userProfile = {}, userPrompt = '') => {
    const { bookmarks = [], completed = [], abandoned = [] } = userProfile;

    const userContextParts = [
        `### USER TASTE PROFILE:`,
        bookmarks.length > 0 ? `- **Favorites:** ${bookmarks.join(', ')}` : null,
        completed.length > 0 ? `- **Completed:** ${completed.join(', ')}` : null,
        abandoned.length > 0
            ? `- **Abandoned:** ${abandoned.join(', ')} (Avoid similar pacing, flaws, or themes)`
            : null,
        `\n### CURRENT REQUEST:`,
        userPrompt
            ? `Vibe requested: "${userPrompt}"`
            : `No specific vibe requested. Suggest hidden gems based on profile.`,
    ];

    const promptContext = userContextParts.filter(Boolean).join('\n');

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptContext,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            responseSchema: RESPONSE_SCHEMA,
        },
    });

    return JSON.parse(response.text);
};
