import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import "../auth.css";

const verifyEmail = () => {
    const [verified, setVerified] = useState("");
    const [error, setError] = useState("");

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    useEffect(() => {
        const verifyUserEmail = async () => {
            try {
                const { data } = await axios.post("/auth/verifyEmail", {
                    token: token ? token : "",
                });
                setVerified(data.message);
            } catch (error) {
                setVerified("");
                setError(error.response?.data?.message);
            }
        };

        if (token?.length > 0) verifyUserEmail();
    }, []);

    return (
        <div className="verify-email-main">
            {verified && (
                <div>
                    <h1 className="text-2xl">Email Verified Successfully</h1>
                    <Link to="/login">Login</Link>
                </div>
            )}
            {error && (
                <div>
                    <h1>{error}</h1>
                </div>
            )}
        </div>
    );
};

export default verifyEmail;
