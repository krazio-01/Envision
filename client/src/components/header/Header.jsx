import { Link } from 'react-router-dom';
import useUserStore from '../../store/store';
import Profile from './Profile';
import NavigationMenu from './NavigationMenu';
import SearchBar from './SearchBar';
import { FaUser } from 'react-icons/fa';
import Logo from '../../assets/images/logo.png';
import './header.css';

const Header = () => {
    const user = useUserStore((state) => state.user);

    return (
        <header className="main-header">
            <div className="container">
                <div className="header-wrapper">
                    <NavigationMenu Logo={Logo} />

                    <SearchBar user={user} />

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
