import { Link, Outlet } from "react-router-dom";
import Logo from "../assets/images/logo.png";
import "./layout.css";

function AuthLayout() {
    return (
        <div className="auth-layout">
            <div className="auth-container">
                <div className="image-section" >
                    <header className="auth-header">
                        <Link to="/">
                            <img src={Logo} alt="logo" />
                            <span>Envision</span>
                        </Link>
                    </header>
                </div>

                <Outlet />
            </div>
        </div>
    );
}

export default AuthLayout;
