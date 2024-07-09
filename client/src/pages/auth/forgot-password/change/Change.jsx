import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useToast from "../../../../hooks/useToast";
import axios from "axios";
import "../../auth.css";

const Change = () => {
    const [loading, setLoading] = useState(false);
    const [formState, setFormState] = useState({
        password: "",
        confirmPassword: "",
    });

    const toast = useToast();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formState.password !== formState.confirmPassword) {
            toast("error", "Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.post("/auth/forgot-password/change", {
                newPassword: formState.password,
                token,
            });
            toast("success", data?.message);
            navigate("/");
        } catch (error) {
            toast("error", error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form-container">
            <h2>Change password</h2>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="password">PNew password</label>
                    <input
                        type="password"
                        id="password"
                        value={formState.password}
                        onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="confirmPassword">Confirm new password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={formState.confirmPassword}
                        onChange={(e) =>
                            setFormState({ ...formState, confirmPassword: e.target.value })
                        }
                        required
                    />
                </div>
                <button
                    disabled={loading}
                    className={`auth-btn ${loading && "loading"}`}
                    type="submit"
                >
                    {loading ? "Updating..." : "Change"}
                </button>
            </form>
        </div>
    );
};

export default Change;
