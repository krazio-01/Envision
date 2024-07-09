import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useToast from "../../../hooks/useToast";
import axios from "axios";
import "../auth.css";

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        password: "",
    });

    const toast = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const { data } = await axios.post("/auth/signup", formState);
            toast("success", data?.message);
            navigate("/login");
        } catch (error) {
            console.log(error);
            toast("error", error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form-container">
            <h2>Create an account</h2>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={formState.password}
                        onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                        required
                    />
                </div>

                <button
                    disabled={loading}
                    className={`auth-btn ${loading && "loading"}`}
                    type="submit"
                >
                    {loading ? "Signing up..." : "Sign up"}
                </button>
            </form>

            <div className="auth-form-footer">
                <p>
                    Already have an account? <Link to="/login">Sign in.</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
