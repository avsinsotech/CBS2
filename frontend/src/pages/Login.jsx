import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Login = () => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        loginCode: '',
        password: '',
        brcd: '1',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Invalid login credentials');
            }

            // data contains { message, user, parameters, bankInfo, menus }
            login(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-shape shape-1"></div>
            <div className="login-shape shape-2"></div>
            <div className="login-shape shape-3"></div>
            
            <div className="login-card">
                <div className="login-header">
                    <h2>Welcome Back</h2>
                    <p>Enter your credentials to access your account</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {error && <div className="login-error">{error}</div>}
                    
                    <div className="input-group">
                        <input 
                            type="text" 
                            name="loginCode" 
                            id="loginCode" 
                            value={formData.loginCode} 
                            onChange={handleChange} 
                            placeholder=" "
                            required
                        />
                        <label htmlFor="loginCode">Username / Login Code</label>
                    </div>

                    <div className="input-group">
                        <input 
                            type="password" 
                            name="password" 
                            id="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            placeholder=" "
                            required
                        />
                        <label htmlFor="password">Password</label>
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
