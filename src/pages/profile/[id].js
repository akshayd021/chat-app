import { useRouter } from 'next/router';
import axios from 'axios';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SoketContext'; // Import your socket context

const UploadImage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');
    const { authUser } = useAuth();
    const { socket } = useSocket(); // Get the socket instance

    const [message, setMessage] = useState('');

    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];
        setImage(selectedFile);
        if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleDelete = () => {
        setImage(null);
        setPreview('');
        setMessage('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('image', image);

        try {
            const token = localStorage.getItem('authUser');
            const response = await axios.post(`http://192.168.29.219:5000/api/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
                params: { id },
            });

            const imageUrl = response?.data?.imagePath; // Assuming your API returns the image URL

            // Emit the message through the socket
            const messageData = {
                senderId: authUser.id,
                receiverId: id, // Assuming 'id' is the receiver's ID
                message: imageUrl, // Send the image URL
            };
            socket.emit('send-message', messageData); // Send the message through the socket

            setMessage(response?.data?.message);
            console.log('Uploaded image URL:', imageUrl);
            handleDelete(); // Clear the preview and image after successful upload

        } catch (error) {
            console.error(error);
            setMessage('Failed to upload image.');
        }
    };

    return (
        <div className="flex flex-col items-center p-4 bg-gray-100 rounded-md shadow-md">
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                    className="mb-4"
                />
                {preview && (
                    <div className="relative mb-4">
                        <img src={preview} alt="Preview" className="w-64 h-64 object-cover rounded-full shadow" />
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full py-1 px-2"
                        >
                            X
                        </button>
                    </div>
                )}

                <p className="my-4 text-text text-lg text-center font-semibold"> <span className="text-black">User Name :</span> {authUser?.username} </p>
                <button
                    disabled={!image}
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                >
                    Upload Image
                </button>
                {message && <p className="mt-2 text-green-600">{message}</p>}
            </form>
        </div>
    );
};

export default UploadImage;
