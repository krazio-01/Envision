import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MdMovie } from 'react-icons/md';
import { BiSolidMoviePlay } from 'react-icons/bi';
import useClickOutside from '../../hooks/useClickOutside';

const NavigationMenu = ({ Logo }) => {
    const [isMenuClicked, setIsMenuClicked] = useState(false);
    const menuRef = useRef();

    const toggleMenu = () => setIsMenuClicked(!isMenuClicked);

    useClickOutside(menuRef, () => setIsMenuClicked(false));

    return (
        <div className="start">
            <div className="burger-menu" onClick={toggleMenu}>
                <div className={`burger-bar ${isMenuClicked ? 'clicked' : 'unclicked'}`}></div>
                <div className={`burger-bar ${isMenuClicked ? 'clicked' : 'unclicked'}`}></div>
                <div className={`burger-bar ${isMenuClicked ? 'clicked' : 'unclicked'}`}></div>
            </div>

            <div className={`menu ${isMenuClicked ? 'visible' : ''}`} ref={menuRef}>
                <h4>Explore</h4>
                <ul>
                    <li>
                        <Link to="/explore/movie" className="menu-item" onClick={toggleMenu}>
                            <MdMovie /> <span>Movies</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/explore/tv" className="menu-item" onClick={toggleMenu}>
                            <BiSolidMoviePlay /> <span>TV Shows</span>
                        </Link>
                    </li>
                </ul>
            </div>

            <Link className="logo" to={'/'}>
                <img src={Logo} alt="logo" />
                <span>Envision</span>
            </Link>
        </div>
    );
};

export default NavigationMenu;
