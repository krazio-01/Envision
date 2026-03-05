import { useState, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useUserStore from '../../store/store';
import axios from 'axios';
import Profile from './Profile/Profile';
import MediaItem from '../content/mediaItem/MediaItem';
import { debounce } from 'lodash';
import { FaSearch, FaUser } from 'react-icons/fa';
import { MdMovie } from 'react-icons/md';
import { BiSolidMoviePlay } from 'react-icons/bi';
import Logo from '../../assets/images/logo.png';
import useToast from '../../hooks/useToast';
import './header.css';

const Header = () => {
    const [searchMode, setSearchMode] = useState('standard');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestion, setShowSuggestion] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [showAiDropdown, setShowAiDropdown] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [isMenuClicked, setIsMenuClicked] = useState(false);
    const [burgerClass, setBurgerClass] = useState('burger-bar unclicked');
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    const navigate = useNavigate();
    const toast = useToast();
    const user = useUserStore((state) => state.user);

    const menuRef = useRef();
    const inputRef = useRef();

    const updateMenu = () => {
        const newBurgerClass = isMenuClicked ? 'burger-bar unclicked' : 'burger-bar clicked';
        setBurgerClass(newBurgerClass);
        setIsMenuClicked(!isMenuClicked);
    };

    const fetchSuggestions = async (inputValue) => {
        if (inputValue.trim().length > 0) {
            try {
                const { data } = await axios.get(`/multi/suggestions?query=${inputValue}`);
                setShowSuggestion(true);
                setShowAiDropdown(false);
                setSuggestions(data.results);
            } catch (error) {
                console.log(error);
            }
        } else {
            setShowSuggestion(false);
            setSuggestions([]);
        }
    };

    const debouncedHandleSearch = useCallback(
        debounce((inputValue) => {
            fetchSuggestions(inputValue);
        }, 300),
        [],
    );

    const handleInputChange = (e) => {
        if (searchMode === 'ai') {
            setShowSuggestion(false);
            return;
        }

        const inputValue = e.target.value;
        debouncedHandleSearch(inputValue);
    };

    const handleSearch = (e) => {
        const value = inputRef.current.value;
        if ((e.key === 'Enter' || e.type === 'click') && value.length > 0) {
            navigate(`/search/${value}`);
            setSuggestions([]);
            setShowSuggestion(false);
            setShowAiDropdown(false);
            inputRef.current.value = '';
            inputRef.current.blur();
            setShowMobileSearch(false);
        }
    };

    const handleAiSuggest = async () => {
        const prompt = inputRef.current.value;

        if (!prompt.trim() && !user) {
            toast('error', "Type a vibe (e.g., 'funny action movie') or log in for personal picks!");
            return;
        }

        setShowSuggestion(false);
        setShowAiDropdown(true);
        setIsAiLoading(true);

        try {
            const { data } = await axios.post('/recommendations', { prompt });
            setAiSuggestions(data.data);

            setTimeout(() => {
                setAiSuggestions([
                    { title: 'Inception', mediaType: 'Movie', reason: 'Because you wanted something mind-bending.' },
                    {
                        title: 'Severance',
                        mediaType: 'TV Show',
                        reason: 'A perfect match for psychological thrillers.',
                    },
                ]);
                setIsAiLoading(false);
            }, 2000);
        } catch (error) {
            console.error('AI Fetch Error:', error);
            setIsAiLoading(false);
        }
    };

    return (
        <header className="main-header">
            <div className="container">
                <div className="header-wrapper">
                    <div className="start">
                        <div className="burger-menu" onClick={updateMenu}>
                            <div className={burgerClass}></div>
                            <div className={burgerClass}></div>
                            <div className={burgerClass}></div>
                        </div>
                        <div className={`menu ${isMenuClicked ? 'visible' : ''}`} ref={menuRef}>
                            <h4>Explore</h4>
                            <ul>
                                <li>
                                    <Link to="/explore/movie" className="menu-item" onClick={updateMenu}>
                                        <MdMovie />
                                        <span>Movies</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/explore/tv" className="menu-item" onClick={updateMenu}>
                                        <BiSolidMoviePlay />
                                        <span>TV Shows</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <Link className="logo" to={'/'}>
                            <img src={Logo} alt="logo" />
                            <span>Envision</span>
                        </Link>
                    </div>

                    <div className="search-container">
                        <div className="mobile-search" onClick={() => setShowMobileSearch((prev) => !prev)}>
                            <button>
                                <FaSearch />
                            </button>
                        </div>

                        <div className={`search_wrapper ${showMobileSearch ? 'show' : ''}`}>
                            <div className="search">
                                <div
                                    onClick={() => {
                                        setSearchMode((prev) => (prev === 'standard' ? 'ai' : 'standard'));
                                        inputRef.current.focus();
                                    }}
                                    style={{
                                        padding: '0 15px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: searchMode === 'ai' ? '#ff004f' : '#888',
                                        borderRight: '1px solid #333',
                                        fontWeight: 'bold',
                                        fontSize: '14px',
                                        userSelect: 'none',
                                    }}
                                    title="Click to toggle AI Mode"
                                >
                                    {searchMode === 'ai' ? '✨ AI' : <FaSearch />}
                                </div>

                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder={
                                        searchMode === 'ai'
                                            ? "Type a vibe (e.g., 'funny sci-fi')..."
                                            : 'Search for movies or TV shows...'
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            if (searchMode === 'ai') handleAiSuggest();
                                            else handleSearch(e);
                                        }
                                    }}
                                    onChange={handleInputChange}
                                    style={{ paddingLeft: '15px' }}
                                />

                                <div className={`search_suggest ${showSuggestion && 'show'}`}>
                                    {suggestions.length > 0 && (
                                        <>
                                            <div className="body">
                                                {suggestions.slice(0, 5).map((suggestion, index) => (
                                                    <MediaItem
                                                        key={index}
                                                        suggestion={suggestion}
                                                        setShowSuggestion={setShowSuggestion}
                                                    />
                                                ))}
                                            </div>
                                            <div className="foot" onClick={handleSearch}>
                                                <a className="btn w-100 btn-gardient">View All Results</a>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className={`search_suggest ai-dropdown ${showAiDropdown && 'show'}`}>
                                    <div
                                        className="ai-dropdown-header"
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            borderBottom: '1px solid #333',
                                            paddingBottom: '10px',
                                            marginBottom: '10px',
                                        }}
                                    >
                                        <h4 style={{ margin: '0 10px', color: '#ff004f' }}>✨ AI Recommendations</h4>
                                        <button
                                            className="close-btn"
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#888',
                                                cursor: 'pointer',
                                                marginRight: '10px',
                                            }}
                                            onClick={() => setShowAiDropdown(false)}
                                        >
                                            ✖
                                        </button>
                                    </div>
                                    {!user && (
                                        <div
                                            style={{
                                                padding: '10px',
                                                fontSize: '12px',
                                                color: '#bbb',
                                                borderLeft: '3px solid #ff004f',
                                                margin: '0 10px 15px',
                                            }}
                                        >
                                            💡 Log in to get suggestions tailored to your bookmarks!
                                        </div>
                                    )}
                                    {isAiLoading ? (
                                        <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                                            Gemini is analyzing vibes...
                                        </div>
                                    ) : (
                                        <div className="body" style={{ padding: '0 10px' }}>
                                            {aiSuggestions.map((item, index) => (
                                                <div
                                                    key={index}
                                                    style={{
                                                        marginBottom: '15px',
                                                        borderBottom: '1px solid #333',
                                                        paddingBottom: '10px',
                                                    }}
                                                >
                                                    <h5 style={{ margin: '0 0 5px 0', color: '#fff' }}>
                                                        {item.title}{' '}
                                                        <span
                                                            style={{
                                                                fontSize: '10px',
                                                                backgroundColor: '#333',
                                                                padding: '2px 6px',
                                                                borderRadius: '4px',
                                                                textTransform: 'uppercase',
                                                            }}
                                                        >
                                                            {item.mediaType}
                                                        </span>
                                                    </h5>
                                                    <p
                                                        style={{
                                                            margin: 0,
                                                            fontSize: '12px',
                                                            color: '#999',
                                                            lineHeight: '1.4',
                                                        }}
                                                    >
                                                        {item.reason}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={searchMode === 'ai' ? handleAiSuggest : handleSearch}
                                    style={
                                        searchMode === 'ai'
                                            ? {
                                                background: 'linear-gradient(90deg, #ff004f, #ff4081)',
                                                color: 'white',
                                                width: 'auto',
                                                padding: '0 20px',
                                                fontWeight: 'bold',
                                            }
                                            : {}
                                    }
                                >
                                    {searchMode === 'ai' ? 'Suggest' : <FaSearch />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="options">
                        {user ? (
                            <Profile />
                        ) : (
                            <div className="sign-container">
                                <Link className="login-link" to="/login">
                                    <FaUser />
                                    <span>Sign In</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
