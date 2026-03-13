import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useToast from '../../hooks/useToast';
import axios from 'axios';
import useUserStore from '../../store/store';
import { FaHeart, FaUser } from 'react-icons/fa';
import { IoIosLogOut } from 'react-icons/io';
import useClickOutside from '../../hooks/useClickOutside';

const Profile = () => {
    const { user, clearUser } = useUserStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);
    const toast = useToast();

    useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

    const handleLogout = async () => {
        try {
            await axios.post('/auth/logout', {}, { withCredentials: true });
            clearUser();
            window.location.reload();
        } catch (error) {
            toast('error', error.response?.data?.message);
        }
    };

    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : null;

    return (
        <div className="profile" ref={dropdownRef}>
            <div className="profile-icon" onClick={() => setIsDropdownOpen((prev) => !prev)}>
                {userInitial ? <span>{userInitial}</span> : <FaUser />}
            </div>

            {isDropdownOpen && (
                <div className="profile-menu">
                    <div className="user-info">
                        <p className="user-name">{user?.name || 'Guest'}</p>
                        <p className="user-email">{user?.email || 'Not logged in'}</p>
                    </div>

                    <div className="profile-divider" />

                    <Link to="/bookmarks" className="profile-menu-item" onClick={() => setIsDropdownOpen(false)}>
                        <FaHeart />
                        <span>Bookmarks</span>
                    </Link>
                    <button className="profile-menu-item logout-btn" onClick={handleLogout}>
                        <IoIosLogOut />
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Profile;
