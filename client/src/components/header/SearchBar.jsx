import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { debounce } from 'lodash';
import { FaSearch, FaMagic, FaBolt } from 'react-icons/fa';
import { MdMovie } from 'react-icons/md';
import useToast from '../../hooks/useToast';
import SuggestionsDropdown from './SuggestionsDropdown';

const SearchBar = ({ user }) => {
    const [searchMode, setSearchMode] = useState('standard');
    const [inputValue, setInputValue] = useState('');
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [standardSearch, setStandardSearch] = useState({
        suggestions: [],
        showDropdown: false,
    });
    const [aiSearch, setAiSearch] = useState({
        suggestions: [],
        showDropdown: false,
        isLoading: false,
    });

    const navigate = useNavigate();
    const toast = useToast();

    const updateStandard = (updates) => setStandardSearch((prev) => ({ ...prev, ...updates }));
    const updateAi = (updates) => setAiSearch((prev) => ({ ...prev, ...updates }));

    const fetchSuggestions = async (query) => {
        if (!query.trim()) {
            return updateStandard({ showDropdown: false, suggestions: [] });
        }
        try {
            const { data } = await apiClient.get(`/multi/suggestions?query=${query}`);
            updateStandard({ suggestions: data.results, showDropdown: true });
            updateAi({ showDropdown: false });
        } catch (error) {
            console.error('Fetch Error:', error);
        }
    };

    const debouncedSearch = useCallback(debounce(fetchSuggestions, 300), []);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        if (searchMode === 'standard') debouncedSearch(value);
        else updateStandard({ showDropdown: false });
    };

    const handleStandardSearch = () => {
        if (inputValue.trim()) {
            navigate(`/search/${inputValue}`);
            resetSearchState();
        }
    };

    const handleAiSuggest = async () => {
        if (aiSearch.isLoading) return;

        if (!inputValue.trim() && !user)
            return toast('error', 'Search requires a prompt. Log in for personalized results.');

        updateStandard({ showDropdown: false });
        updateAi({ showDropdown: true, isLoading: true });

        try {
            const { data } = await apiClient.post('/ideas/recommendations', {
                prompt: inputValue,
            });
            updateAi({ suggestions: data.data });
        } catch (error) {
            console.error('AI Fetch Error:', error);
            toast('error', 'Failed to fetch AI suggestions.');
        } finally {
            updateAi({ isLoading: false });
        }
    };

    const resetSearchState = () => {
        updateStandard({ suggestions: [], showDropdown: false });
        updateAi({ suggestions: [], showDropdown: false });
        setInputValue('');
        setShowMobileSearch(false);
    };

    const toggleSearchMode = () => {
        setSearchMode((prev) => (prev === 'standard' ? 'ai' : 'standard'));
        setInputValue('');
        updateStandard({ showDropdown: false });
        updateAi({ showDropdown: false });
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
                        disabled={aiSearch.isLoading}
                        className={`mode-toggle-btn ${isAiMode ? 'ai-active' : ''}`}
                        onClick={toggleSearchMode}
                        type="button"
                    >
                        {isAiMode ? (
                            <>
                                <MdMovie />
                                <span className="toggle-text">
                                    Standard<span className="hide-on-mobile"> Search</span>
                                </span>
                            </>
                        ) : (
                            <>
                                <FaMagic />
                                <span className="toggle-text">
                                    AI<span className="hide-on-mobile"> Search</span>
                                </span>
                            </>
                        )}
                    </button>

                    <input
                        type="text"
                        value={inputValue}
                        placeholder={
                            isAiMode
                                ? showQuickSuggestBtn
                                    ? 'Type mood, or tap Suggest...'
                                    : 'Search by mood, theme...'
                                : 'Search for movies or TV shows...'
                        }
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                    />

                    <SuggestionsDropdown
                        mode={searchMode}
                        show={isAiMode ? aiSearch.showDropdown : standardSearch.showDropdown}
                        suggestions={isAiMode ? aiSearch.suggestions : standardSearch.suggestions}
                        isLoading={aiSearch.isLoading}
                        user={user}
                        onClose={() => updateAi({ showDropdown: false })}
                        onViewAll={handleStandardSearch}
                        setShowSuggestion={(val) => updateStandard({ showDropdown: val })}
                    />

                    <button
                        disabled={aiSearch.isLoading}
                        className={`action-btn ${searchMode}`}
                        type="button"
                        onClick={isAiMode ? handleAiSuggest : handleStandardSearch}
                    >
                        {isAiMode ? (
                            showQuickSuggestBtn ? (
                                <>
                                    <FaBolt />
                                    <span className="hide-on-mobile">Quick </span>
                                    Suggest
                                </>
                            ) : (
                                'Suggest'
                            )
                        ) : (
                            <FaSearch />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
