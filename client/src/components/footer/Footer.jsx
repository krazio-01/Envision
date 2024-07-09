import { FaGithub, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import ContentWrapper from "../contentWrapper/ContentWrapper";
import "./footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <ContentWrapper>
                <ul className="menuItems">
                    <li className="menuItem">Terms Of Use</li>
                    <li className="menuItem">Privacy-Policy</li>
                    <li className="menuItem">About</li>
                    <li className="menuItem">Blog</li>
                    <li className="menuItem">FAQ</li>
                </ul>
                <div className="infoText">
                    Discover a haven for free online movie streaming. Enjoy the
                    freedom to watch movies anytime, anywhere. Dive into our
                    extensive collection and immerse yourself in cinematic
                    marvels right at your fingertips.
                </div>
                <div className="socialIcons">
                    <span className="icon">
                        <FaGithub />
                    </span>
                    <span className="icon">
                        <FaInstagram />
                    </span>
                    <span className="icon">
                        <FaTwitter />
                    </span>
                    <span className="icon">
                        <FaLinkedin />
                    </span>
                </div>
            </ContentWrapper>
        </footer>
    );
};

export default Footer;
