import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';  // Your AuthContext
import axios from 'axios';
import { useSocket } from '@/context/SoketContext';

const Chat = ({ receiverId, onSelectUser }) => {
    const { authUser } = useAuth();
    const { socket } = useSocket();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    // Fetch message history when the component mounts or receiverId changes
    useEffect(() => {
        const fetchAllUsers = async () => {
            console.log('Fetching all users...'); // Add this log to track calls
            try {
                const response = await axios.get('http://localhost:5000/api/auth/logged-in-users');
                const filter = response?.data?.filter((x) => x?._id !== authUser?.id)
                console.log(filter)
                setAllUsers(filter);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchAllUsers();
    }, []);


    useEffect(() => {
        const fetchMessageHistory = async () => {
            console.log("Fetching message history...");
            console.log("Auth User:", authUser);  // Debugging line
            console.log("Receiver ID:", receiverId);  // Debugging line

            if (authUser && authUser.id && receiverId) {
                try {
                    const response = await axios.get(`http://localhost:5000/api/messages/history/${authUser.id}/${receiverId}`);
                    setMessages(response.data);
                } catch (error) {
                    console.error('Failed to load message history', error);
                }
            }
        };

        fetchMessageHistory();
    }, [authUser, receiverId]);


    useEffect(() => {
        if (socket && authUser) { // Check if socket and authUser are defined
            socket.emit('login', authUser.id);

            // Listen for real-time messages
            socket.on('receive-message', (data) => {
                setMessages((prev) => [...prev, data]);
            });

            // Listen for typing indicator
            socket.on('typing', (senderId) => {
                if (senderId === receiverId) {
                    setIsTyping(true);
                    setTimeout(() => setIsTyping(false), 1000); // Clear typing indicator after 1 second
                }
            });

            return () => {
                socket.off('receive-message');
                socket.off('typing');
            };
        }
    }, [socket, authUser, receiverId]);


    const sendMessage = () => {
        console.log("Auth User:", authUser);  // Debugging line
        console.log("Receiver ID:", receiverId);  // Debugging line
        console.log("Message:", message);  // Debugging line

        if (!authUser || !authUser.id || !receiverId || !message) {
            console.error("Missing required fields to send message");
            return;
        }

        const newMessage = { senderId: authUser.id, receiverId, message };
        socket.emit('send-message', newMessage);

        // Append new message to local state
        setMessages((prev) => [...prev, newMessage]);
        setMessage('');
    };



    const handleTyping = () => {
        socket.emit('typing', { senderId: authUser.id, receiverId });
    };


    return (
        <div>
            <h2>All Users</h2>
            <ul>
                {allUsers?.map(user => (
                    <li key={user._id} onClick={() => onSelectUser(user?._id)}>
                        {user.username}
                    </li>
                ))}
            </ul>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <b>{msg.senderId === authUser.id ? 'You' : 'Other'}:</b> {msg.message}
                    </div>
                ))}
            </div>

            {isTyping && <p>The other user is typing...</p>}

            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleTyping}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
