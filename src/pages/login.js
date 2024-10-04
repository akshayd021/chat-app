// components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setAuthUser } = useAuth();
    const router = useRouter()

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            if (response.status === 200) {
                const userData = response.data.user;
                setAuthUser(userData);  // Set the logged-in user in context
                localStorage.setItem('authUser', JSON.stringify(userData));  // Store user data in localStorage
                router.push("chat")
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div>
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
        </div>
    );
};

export default Login;
