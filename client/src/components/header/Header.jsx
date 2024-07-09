import { useState, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import useUserStore from "../../store/store";
import axios from "axios";
import Profile from "./Profile/Profile";
import MediaItem from "../content/mediaItem/MediaItem";
import { debounce } from "lodash";
import { FaSearch, FaUser } from "react-icons/fa";
import { MdMovie } from "react-icons/md";
import { BiSolidMoviePlay } from "react-icons/bi";
import Logo from "../../assets/images/logo.png";
import "./header.css";

const Header = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [isMenuClicked, setIsMenuClicked] = useState(false);
    const [burgerClass, setBurgerClass] = useState("burger-bar unclicked");
    const [showSuggestion, setShowSuggestion] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    const navigate = useNavigate();
    const user = useUserStore((state) => state.user);

    const menuRef = useRef();
    const inputRef = useRef();

    const updateMenu = () => {
        const newBurgerClass = isMenuClicked ? "burger-bar unclicked" : "burger-bar clicked";
        setBurgerClass(newBurgerClass);
        setIsMenuClicked(!isMenuClicked);
    };

    const fetchSuggestions = async (inputValue) => {
        if (inputValue.trim().length > 0) {
            try {
                const { data } = await axios.get(`/multi/suggestions?query=${inputValue}`);
                setShowSuggestion(true);
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
        []
    );

    const handleInputChange = (e) => {
        inputRef.current = e.target.value;
        debouncedHandleSearch(inputRef.current);
    };

    const handleSearch = (e) => {
        const value = inputRef.current;

        if ((e.key === "Enter" || e.type === "click") && value.length > 0) {
            navigate(`/search/${value}`);

            setSuggestions([]);
            setShowSuggestion(false);

            inputRef.current = "";
            inputRef.current.blur();

            setShowMobileSearch(false);
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
                        <div className={`menu ${isMenuClicked ? "visible" : ""}`} ref={menuRef}>
                            <h4>Explore</h4>
                            <ul>
                                <li>
                                    <Link
                                        to="/explore/movie"
                                        className="menu-item"
                                        onClick={updateMenu}
                                    >
                                        <MdMovie />
                                        <span>Movies</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/explore/tv"
                                        className="menu-item"
                                        onClick={updateMenu}
                                    >
                                        <BiSolidMoviePlay />
                                        <span>TV Shows</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <Link className="logo" to={"/"}>
                            <img src={Logo} alt="logo" />
                            <span>Envision</span>
                        </Link>
                    </div>

                    <div className="search-container">
                        <div
                            className="mobile-search"
                            onClick={() => setShowMobileSearch((prev) => !prev)}
                        >
                            <button>
                                <FaSearch />
                            </button>
                        </div>
                        <div className={`search_wrapper ${showMobileSearch ? "show" : ""}`}>
                            <div className="search">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Search for movies or TV shows..."
                                    onKeyDown={handleSearch}
                                    onChange={handleInputChange}
                                />
                                <div className={`search_suggest ${showSuggestion && "show"}`}>
                                    {suggestions.length > 0 ? (
                                        <>
                                            <div className="body">
                                                {suggestions
                                                    .slice(0, 5)
                                                    .map((suggestion, index) => (
                                                        <MediaItem
                                                            key={index}
                                                            suggestion={suggestion}
                                                            setShowSuggestion={setShowSuggestion}
                                                        />
                                                    ))}
                                            </div>
                                            <div className="foot" onClick={handleSearch}>
                                                <a className="btn w-100 btn-gardient">
                                                    View All Results
                                                </a>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="no-result">No result</div>
                                    )}
                                </div>
                                <button type="button" onClick={handleSearch}>
                                    <FaSearch />
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
