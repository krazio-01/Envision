import MediaItem from '../content/mediaItem/MediaItem';
import { MdMovie } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import { FaExclamation } from 'react-icons/fa';

const SuggestionsDropdown = ({ mode, show, suggestions, isLoading, user, onClose, onViewAll, setShowSuggestion }) => {
    if (!show) return null;

    if (mode === 'ai') {
        return (
            <div className="search_suggest ai-dropdown show">
                <div className="ai-dropdown-header">
                    <h4>
                        <MdMovie /> AI Recommendations
                    </h4>
                    <button className="close-btn" onClick={onClose} type="button">
                        <IoMdClose />
                    </button>
                </div>

                {!user && (
                    <div className="ai-login-warning">
                        <FaExclamation /> Log in to get suggestions tailored to your bookmarks!
                    </div>
                )}

                {isLoading ? (
                    <div className="ai-loading">Gemini is analyzing vibes...</div>
                ) : (
                    <div className="ai-results-body">
                        {suggestions?.length > 0 ? (
                            suggestions.map((item, index) => (
                                <div key={index} className="ai-result-card">
                                    <h5>
                                        {item.title} <span className="ai-badge">{item.mediaType}</span>
                                    </h5>
                                    <p>{item.reason}</p>
                                </div>
                            ))
                        ) : (
                            <p className="ai-empty">No suggestions found. Try a different vibe!</p>
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
                    <MediaItem key={index} suggestion={suggestion} setShowSuggestion={setShowSuggestion} />
                ))}
            </div>
            <div className="foot" onClick={onViewAll}>
                <button
                    type="button"
                    className="btn"
                    style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        marginInline: 'auto',
                        color: 'white',
                    }}
                >
                    View All Results
                </button>
            </div>
        </div>
    );
};

export default SuggestionsDropdown;
