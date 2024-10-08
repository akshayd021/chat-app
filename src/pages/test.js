import React, { useState } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import io from 'socket.io-client';

const socket = io('http://192.168.29.219:5000'); // Adjust to your server address

const ImageUpload = ({ senderId, receiverId }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [message, setMessage] = useState('');

    const handleImageChange = (e) => {
        setSelectedImage(e.target.files[0]);
    };

    const handleSendMessage = async () => {
        let imageUrl = '';

        // Upload image if one is selected
        if (selectedImage) {
            const formData = new FormData();
            formData.append('image', selectedImage);

            try {
                const response = await axios.post('http://192.168.29.219:5000/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                imageUrl = response.data.imageUrl;
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }

        // Send message along with image URL
        socket.emit('send-message', { senderId, receiverId, message, imageUrl });
        setMessage('');
        setSelectedImage(null);
    };

    return (
        <div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message"
                className="border p-2 rounded"
            />
            <FaPlus
                className="text-xl cursor-pointer text-gray-800"
                onClick={() => document.getElementById('fileInput').click()}
            />
            <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }}
                onChange={handleImageChange}
            />
            <button onClick={handleSendMessage} className="bg-blue-500 text-white py-2 px-4 rounded">
                Send
            </button>
        </div>
    );
};

export default ImageUpload;
