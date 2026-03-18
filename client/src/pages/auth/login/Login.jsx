import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useToast from '../../../hooks/useToast';
import apiClient from '../../../api/apiClient';
import useUserStore from '../../../store/store';
import '../auth.css';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [formState, setFormState] = useState({
        email: '',
        password: '',
    });

    const toast = useToast();
    const navigate = useNavigate();
    const setUser = useUserStore((state) => state.setUser);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const { data } = await apiClient.post('/auth/signin', formState);

            setUser(data.user);
            toast('success', data?.message);
            navigate('/');
        } catch (error) {
            toast('error', error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form-container">
            <h1>Welcome back</h1>

            <form onSubmit={handleSubmit}>
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

                <div className="forgot-password">
                    <Link to="/forgot-password/request">Forgot password?</Link>
                </div>

                <button disabled={loading} className={`auth-btn ${loading && 'loading'}`} type="submit">
                    {loading ? 'Signing in...' : 'Sign in'}
                </button>
            </form>

            <div className="auth-form-footer">
                <p>
                    New to Envision? <Link to="/register">Create an account.</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
