import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { debounce } from 'lodash';
import { FaSearch, FaMagic } from 'react-icons/fa';
import { MdMovie } from 'react-icons/md';
import useToast from '../../hooks/useToast';
import SuggestionsDropdown from './SuggestionsDropdown';

const SearchBar = ({ user }) => {
    const [searchMode, setSearchMode] = useState('standard');
    const [inputValue, setInputValue] = useState('');
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestion, setShowSuggestion] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [showAiDropdown, setShowAiDropdown] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);

    const navigate = useNavigate();
    const toast = useToast();

    const fetchSuggestions = async (query) => {
        if (!query.trim()) {
            setShowSuggestion(false);
            return setSuggestions([]);
        }
        try {
            const { data } = await axios.get(`/multi/suggestions?query=${query}`);
            setSuggestions(data.results);
            setShowSuggestion(true);
            setShowAiDropdown(false);
        } catch (error) {
            console.error('Fetch Error:', error);
        }
    };

    const debouncedSearch = useCallback(debounce(fetchSuggestions, 300), []);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        if (searchMode === 'standard') debouncedSearch(value);
        else setShowSuggestion(false);
    };

    const handleStandardSearch = () => {
        if (inputValue.trim()) {
            navigate(`/search/${inputValue}`);
            resetSearchState();
        }
    };

    const handleAiSuggest = async () => {
        if (!inputValue.trim() && !user) {
            return toast('error', 'Guests need to type a vibe! Log in for pure personalized magic.');
        }

        setShowSuggestion(false);
        setShowAiDropdown(true);
        setIsAiLoading(true);

        try {
            const { data } = await axios.post('/ideas/recommendations', { context: inputValue });
            setAiSuggestions(data.data);
        } catch (error) {
            console.error('AI Fetch Error:', error);
            toast('error', 'Failed to fetch AI suggestions.');
        } finally {
            setIsAiLoading(false);
        }
    };

    const resetSearchState = () => {
        setSuggestions([]);
        setShowSuggestion(false);
        setShowAiDropdown(false);
        setInputValue('');
        setShowMobileSearch(false);
    };

    const toggleSearchMode = () => {
        setSearchMode((prev) => (prev === 'standard' ? 'ai' : 'standard'));
        setInputValue('');
        setShowSuggestion(false);
        setShowAiDropdown(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            searchMode === 'ai' ? handleAiSuggest() : handleStandardSearch();
        }
    };

    const isAiMode = searchMode === 'ai';
    const showQuickSuggestBtn = isAiMode && user && !inputValue.trim();

    return (
        <div className="search-container">
            <div className="mobile-search" onClick={() => setShowMobileSearch(!showMobileSearch)}>
                <button>
                    <FaSearch />
                </button>
            </div>

            <div className={`search_wrapper ${showMobileSearch ? 'show' : ''} ${isAiMode ? 'ai-active' : ''}`}>
                <div className="search">
                    <button
                        className={`mode-toggle-btn ${isAiMode ? 'ai-active' : ''}`}
                        onClick={toggleSearchMode}
                        type="button"
                    >
                        {isAiMode ? (
                            <>
                                <MdMovie style={{ fontSize: '16px' }} /> Standard Search
                            </>
                        ) : (
                            <>
                                <FaMagic style={{ fontSize: '14px' }} /> Try AI Search
                            </>
                        )}
                    </button>

                    <input
                        type="text"
                        value={inputValue}
                        placeholder={
                            isAiMode ? "Type a vibe (e.g., 'funny sci-fi')..." : 'Search for movies or TV shows...'
                        }
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                    />

                    <SuggestionsDropdown
                        mode={searchMode}
                        show={searchMode === 'ai' ? showAiDropdown : showSuggestion}
                        suggestions={searchMode === 'ai' ? aiSuggestions : suggestions}
                        isLoading={isAiLoading}
                        user={user}
                        onClose={() => setShowAiDropdown(false)}
                        onViewAll={handleStandardSearch}
                        setShowSuggestion={setShowSuggestion}
                    />

                    <button
                        className={`action-btn ${searchMode}`}
                        type="button"
                        onClick={isAiMode ? handleAiSuggest : handleStandardSearch}
                    >
                        {isAiMode ? showQuickSuggestBtn ? 'Quick Suggestion' : 'Suggest' : <FaSearch />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
