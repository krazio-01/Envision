import { useState } from "react";
import { Link } from "react-router-dom";
import useToast from "../../../../hooks/useToast";
import axios from "axios";
import "../../auth.css";

const Request = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");

    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const { data } = await axios.post("/auth/forgot-password/request", { email });
            toast("custom", data.message, { duration: Infinity });
        } catch (error) {
            toast("error", error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form-container">
            <h2>Requeest for change</h2>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email">Please enter your email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button
                    disabled={loading}
                    className={`auth-btn ${loading && "loading"}`}
                    type="submit"
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>

            <div className="auth-form-footer">
                <p>
                    Go back <Link to="/login">login.</Link>
                </p>
            </div>
        </div>
    );
};

export default Request;
