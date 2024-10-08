// components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setAuthUser } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://192.168.29.219:5000/api/auth/login', { username, password });
            if (response.status === 200) {
                const userData = response.data.user;
                setAuthUser(userData);  // Set the logged-in user in context
                localStorage.setItem('authUser', JSON.stringify(userData));  // Store user data in localStorage
                router.push("/");
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-full focus:outline-none focus:border-blue-500"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 rounded-md px-4 py-2 mb-6 w-full focus:outline-none focus:border-blue-500"
                />
                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
                >
                    Login
                </button>
                <p className="text-center text-gray-600 mt-4">
                    Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
