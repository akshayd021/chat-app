import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useScreen } from '@/context/ScreenContext';
import ImageModal from './ImageModel';

const Message = ({ messages }) => {
    const messageEndRef = useRef(null);
    const { authUser } = useAuth();
    const { isMobile } = useScreen();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    const openModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage('');
    };

    return (
        <div className="w-full absolute bottom-7 p-4 lg:h-[90vh] h-[90vh] overflow-hidden rounded-lg">
            <div className="space-y-4 flex flex-col h-full overflow-y-auto scrollbar-hide">
                {messages?.map((chat) => (
                    <div
                        key={chat._id}
                        className={`flex ${chat.senderId !== authUser?.id ? "justify-start" : "justify-end"}`}
                    >
                        <div className={`flex items-center space-x-2 ${chat.senderId !== authUser?.id ? "mr-2" : "ml-2"}`}>
                            <div className={`${chat.message?.includes("http://192.168.29.219:5000/uploads/") ? "" : (chat.senderId !== authUser?.id ? "bg-[#F3F4F6] text-black p-2" : "bg-[#0F57FF] text-white p-2")} rounded-lg max-w-xs`}>
                                {chat.message?.includes("http://192.168.29.219:5000/uploads/") ? (
                                    <img
                                        src={chat.message}
                                        alt="sent"
                                        onClick={() => openModal(chat.message)} // Open modal on click
                                        style={{ maxWidth: `${isMobile ? "50%" : "100%"}`, borderRadius: '5px', cursor: 'pointer' }}
                                        className="border object-contain"
                                    />
                                ) : (
                                    <p>{chat.message}</p>
                                )}
                                <p className={`text-xs text-right  ${chat.senderId !== authUser?.id ? "text-gray-600": "text-white"}`}>
                                    {new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>

            {/* Modal for displaying the image */}
            <ImageModal isOpen={isModalOpen} onClose={closeModal} imageUrl={selectedImage} />
        </div>
    );
};

export default Message;
