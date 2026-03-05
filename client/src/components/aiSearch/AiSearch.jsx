import { useState } from 'react';
import useToast from "../../hooks/useToast";
import axios from 'axios'
import './aiSearch.css';

const AiSearch = ({ isLoggedIn }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const toast = useToast();

    const handleAiSuggest = async () => {
        if (!prompt.trim() && !isLoggedIn) {
            toast("error", "Type a vibe like 'funny action movie' or log in for personal picks!");
            return;
        }

        setIsLoading(true);
        setShowDropdown(true);

        try {
            const context = null;
            const { data } = await axios.post('/recommendations', { context });

            setTimeout(() => {
                setSuggestions([
                    { title: "Inception", mediaType: "Movie", reason: "Because you wanted something mind-bending." },
                    { title: "Severance", mediaType: "TV Show", reason: "A perfect match for psychological thrillers." },
                    { title: "Interstellar", mediaType: "Movie", reason: "Epic sci-fi based on your recent bookmarks." }
                ]);
                setIsLoading(false);
            }, 2000);

        } catch (error) {
            console.error("Failed to fetch suggestions", error);
            setIsLoading(false);
        }
    };

    const closeDropdown = () => {
        setShowDropdown(false);
        setSuggestions([]);
    };

    return (
        <div className="ai-search-container">
            <div className="search-bar-wrapper">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>

                <input
                    type="text"
                    placeholder="Search for movies, TV shows, or a vibe..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="search-input"
                />

                <button className="ai-suggest-btn" onClick={handleAiSuggest}>
                    AI Suggest
                </button>
            </div>

            {showDropdown && (
                <div className="ai-dropdown">
                    <div className="dropdown-header">
                        <h3>✨ AI Recommendations</h3>
                        <button className="close-btn" onClick={closeDropdown}>✖</button>
                    </div>

                    {!isLoggedIn && (
                        <div className="login-warning">
                            Log in to get suggestions tailored to your bookmarks!
                        </div>
                    )}

                    {isLoading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Gemini is analyzing the vibes...</p>
                        </div>
                    ) : (
                        <div className="suggestions-list">
                            {suggestions.map((item, index) => (
                                <div key={index} className="suggestion-card">
                                    <div className="suggestion-header">
                                        <h4>{item.title}</h4>
                                        <span className="badge">{item.mediaType}</span>
                                    </div>
                                    <p className="reason">{item.reason}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AiSearch;
