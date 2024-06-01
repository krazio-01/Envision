import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { MdMovie } from "react-icons/md";
import { BiSolidMoviePlay } from "react-icons/bi";
import Logo from "../../assets/images/logo.png";
import { debounce } from "lodash";
import "./header.css";
import axios from "axios";
import MediaItem from "../content/mediaItem/mediaItem";

const Header = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [isMenuClicked, setIsMenuClicked] = useState(false);
    const [burgerClass, setBurgerClass] = useState("burger-bar unclicked");
    const [showSuggestion, setShowSuggestion] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    const navigate = useNavigate();

    const inputRef = useRef();
    const menuRef = useRef();

    const updateMenu = () => {
        const newBurgerClass = isMenuClicked
            ? "burger-bar unclicked"
            : "burger-bar clicked";

        setBurgerClass(newBurgerClass);
        setIsMenuClicked(!isMenuClicked);
    };

    const fetchSuggestions = useRef(
        debounce(async (value) => {
            if (value.length === 0) {
                setSuggestions([]);
                setShowSuggestion(false);
                return;
            }

            const { data } = await axios.get(`/multi/suggestions?query=${value}`);
            setShowSuggestion(true);
            setSuggestions(data.results);
        }, 75)
    ).current;

    const handleSearch = (e) => {
        const value = inputRef.current.value;

        if ((e.key === "Enter" || e.type === "click") && value.length > 0) {
            fetchSuggestions.cancel();
            navigate(`/search/${value}`);

            setSuggestions([]);
            setShowSuggestion(false);

            inputRef.current.value = "";
            inputRef.current.blur();

            setShowMobileSearch(false);
        }
    };

    const toggleMobileSearch = () => {
        setShowMobileSearch(!showMobileSearch);
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header-wrapper">
                    <div className="start">
                        <div className="burger-menu" onClick={updateMenu}>
                            <div className={burgerClass}></div>
                            <div className={burgerClass}></div>
                            <div className={burgerClass}></div>
                        </div>
                        <div
                            className={`menu ${isMenuClicked ? "visible" : ""}`}
                            ref={menuRef}
                        >
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
                        <div className="mobile-search" onClick={toggleMobileSearch}>
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
                                    onKeyUp={handleSearch}
                                    onChange={({ target: { value } }) => fetchSuggestions(value)}
                                />
                                <div className={`search_suggest ${showSuggestion && "show"}`}>
                                    {suggestions.length > 0 ? (
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
                                                <a className="btn w-100 btn-gardient" type>
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
                        <div className="user">
                            <a
                                className="btn-header include-text"
                                data-toggle="modal"
                                data-target="#sign"
                            >
                                <i className="fas fa-user"></i>
                                <span>Sign In</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
