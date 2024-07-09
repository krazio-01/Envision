import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useToast from "../../../hooks/useToast";
import axios from "axios";
import useUserStore from "../../../store/store";
import { FaHeart, FaUser } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import "../header.css";

const Profile = () => {
    const { user, clearUser } = useUserStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);
    const toast = useToast();

    const handleLogout = async () => {
        try {
            await axios.post("/auth/logout", {}, { withCredentials: true });
            clearUser();
            window.location.reload();
        } catch (error) {
            toast("error", error.response?.data?.message);
        }
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="profile" ref={dropdownRef}>
            <div className="profile-icon" onClick={() => setIsDropdownOpen((prev) => !prev)}>
                <FaUser />
            </div>

            {isDropdownOpen && (
                <div className="profile-menu">
                    <div className="user-info">
                        <p>{user?.name}</p>
                        <p>{user?.email}</p>
                    </div>

                    <div className="profile-divider" />

                    <Link
                        to="/bookmarks"
                        className="profile-menu-item"
                        onClick={() => setIsDropdownOpen(false)}
                    >
                        <FaHeart />
                        <span>Bookmarks</span>
                    </Link>
                    <button className="profile-menu-item" onClick={handleLogout}>
                        <IoIosLogOut />
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Profile;
