// components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://192.168.29.219:5000/api/auth/signup', { username, password });
            if (response.status === 201) {
                // Redirect to login or home page after successful registration
                router.push('/login');
            }
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
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
                    onClick={handleRegister}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
                >
                    Register
                </button>
                <p className="text-center text-gray-600 mt-4">
                    Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
                </p>
            </div>
        </div>
    );
};

export default Register;
