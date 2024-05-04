import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../redux/authSlice';
import '../assets/css/Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = () => {
        dispatch(loginUser({
            username, password
        }));
    }

    useEffect(() => {
        if (auth.isAuthenticated) {
            navigate("/userDetails")
        }
    }, [auth.isAuthenticated])


    return (
        <div className="login-box">
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <p>
                New user? <a href="/register">Create an account</a>
            </p>
            {auth.error && <p className="error">{auth.error}</p>}
        </div>
    );
};

export default Login;
