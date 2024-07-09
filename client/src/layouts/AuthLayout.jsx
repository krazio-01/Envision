import { Link, Outlet } from "react-router-dom";
import Logo from "../assets/images/logo.png";
import "./layout.css";

function AuthLayout() {
    return (
        <div className="auth-layout">
            <header className="auth-header">
                <Link to="/">
                    <img src={Logo} alt="logo" />
                    <span>Envision</span>
                </Link>
            </header>

            <div className="auth-container">
                <Outlet />
            </div>
        </div>
    );
}

export default AuthLayout;
