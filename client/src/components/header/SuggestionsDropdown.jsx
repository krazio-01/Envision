import { memo } from 'react';
import MediaItem from '../content/mediaItem/MediaItem';
import { IoMdClose } from 'react-icons/io';
import { MdAutoAwesome, MdInsights } from 'react-icons/md';
import { FaExclamation } from 'react-icons/fa';

const SuggestionsDropdown = ({ mode, show, suggestions, isLoading, user, onClose, onViewAll, setShowSuggestion }) => {
    if (!show) return null;

    if (mode === 'ai') {
        return (
            <div className="search_suggest ai-dropdown show">
                <div className="ai-dropdown-header">
                    <h4>
                        <MdInsights /> AI Recommendations
                    </h4>
                    <button disabled={isLoading} className="close-btn" onClick={onClose} type="button">
                        <IoMdClose />
                    </button>
                </div>

                {!user && (
                    <div className="ai-login-warning">
                        <FaExclamation /> Log in for personalized results.
                    </div>
                )}

                {isLoading ? (
                    <div className="loading-state">Binge-watching the entire internet to find your match...</div>
                ) : (
                    <div className="results">
                        {suggestions?.length > 0 ? (
                            suggestions.map((item, index) => (
                                <div key={item.id || index}>
                                    <MediaItem suggestion={item} setShowSuggestion={setShowSuggestion} />
                                    {item.reason && (
                                        <div className="reason-wrapper">
                                            <MdAutoAwesome />
                                            <p>{item.reason}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="not-found">No matches found. Try adjusting your prompt.</p>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (!suggestions || suggestions.length === 0) return null;

    return (
        <div className="search_suggest show">
            <div className="body">
                {suggestions.slice(0, 5).map((suggestion, index) => (
                    <MediaItem
                        key={suggestion.id || index}
                        suggestion={suggestion}
                        setShowSuggestion={setShowSuggestion}
                    />
                ))}
            </div>
            <div className="foot" onClick={onViewAll}>
                <button type="button" className="view-all-btn btn">
                    View All Results
                </button>
            </div>
        </div>
    );
};

export default memo(SuggestionsDropdown);
