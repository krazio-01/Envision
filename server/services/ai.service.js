import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODEL_PRIORITY_LIST = (process.env.GEMINI_MODELS || 'gemini-2.5-flash')
    .split('|')
    .map((m) => m.trim())
    .filter(Boolean);

const SYSTEM_INSTRUCTION = `You are an elite streaming platform recommendation engine. Your goal is to suggest exactly 4 highly accurate titles to watch next.
### INSTRUCTIONS:
1. Analyze the user's taste profile to determine preferred genres, pacing, and tones.
2. CRITICAL: Do NOT recommend any titles already listed in their Favorites, Completed, or Abandoned lists. Suggest entirely new media.
3. If the user provides a specific vibe, prioritize it while utilizing their Taste Profile.
4. If no specific vibe is provided, recommend hidden gems or highly acclaimed titles aligning with their profile, strictly avoiding themes or pacing of their abandoned titles.`;

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

const fetchWithFallback = async (promptContext) => {
    const MAX_RETRIES = 3;
    let lastError;

    for (const currentModel of MODEL_PRIORITY_LIST) {
        let attempt = 0;
        let delay = 1000;

        while (attempt < MAX_RETRIES) {
            try {
                const response = await ai.models.generateContent({
                    model: currentModel,
                    contents: promptContext,
                    config: {
                        systemInstruction: SYSTEM_INSTRUCTION,
                        responseMimeType: 'application/json',
                        responseSchema: RESPONSE_SCHEMA,
                    },
                });

                return JSON.parse(response.text);
            } catch (error) {
                lastError = error;

                if (error.status === 404 || error.status === 429) {
                    console.warn(`${error.status} on ${currentModel}. Switching tiers...`);
                    break;
                }

                if (error.status === 503) {
                    attempt++;
                    if (attempt >= MAX_RETRIES) break;

                    await new Promise((resolve) => setTimeout(resolve, delay));
                    delay *= 2;
                } else {
                    throw error;
                }
            }
        }
    }

    throw lastError;
};

export const generateMediaSuggestions = async (userProfile = {}, userPrompt = '') => {
    const { bookmarks = [], completed = [], abandoned = [] } = userProfile;
    const hasProfileData = bookmarks.length > 0 || completed.length > 0 || abandoned.length > 0;
    const userContextParts = [];

    if (hasProfileData) {
        userContextParts.push(`### USER TASTE PROFILE:`);
        if (bookmarks.length > 0) userContextParts.push(`- **Favorites:** ${bookmarks.join(', ')}`);
        if (completed.length > 0) userContextParts.push(`- **Completed:** ${completed.join(', ')}`);
        if (abandoned.length > 0)
            userContextParts.push(`- **Abandoned:** ${abandoned.join(', ')} (Avoid similar pacing, flaws, or themes)`);
    }

    userContextParts.push(
        `\n### CURRENT REQUEST:`,
        userPrompt
            ? `Vibe requested: "${userPrompt}"`
            : `No specific vibe requested. Suggest hidden gems based on profile.`,
    );

    const promptContext = userContextParts.join('\n');

    return await fetchWithFallback(promptContext);
};
