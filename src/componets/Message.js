import { chatData } from '@/utils/user'; // Ensure this imports your chat data correctly
import React, { useEffect, useRef } from 'react';

const Message = () => {
    const messageEndRef = useRef(null);

    // Scroll to the bottom when the component mounts or when chat data changes
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatData]);

    return (
        <div className="w-full absolute bottom-7 p-4 lg:h-[90vh] h-[90vh] overflow-hidden rounded-lg">
            <div className="space-y-4 flex flex-col h-full overflow-y-auto scrollbar-hide">
                {chatData?.map((chat) => (
                    <div
                        key={chat.id}
                        className={`flex ${chat.sender === "User 1" ? "justify-start" : "justify-end"}`}
                    >
                        <div className={`flex items-center space-x-2 ${chat.sender === "User 1" ? "mr-2" : "ml-2"}`}>
                            {chat.sender === "User 1" && (
                                <div className="bg-[#F3F4F6] text-black p-2 rounded-lg max-w-xs">
                                    <p>{chat.message}</p>
                                    {/* <p className="text-xs text-right text-text">
                                        {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p> */}
                                </div>
                            )}
                            {chat.sender === "User 2" && (
                                <div className="bg-[#0F57FF] text-white p-2 rounded-lg max-w-xs">
                                    <p>{chat.message}</p>
                                    {/* <p className="text-xs text-right text-gray-00">
                                        {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p> */}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messageEndRef} /> {/* Keep this for scrolling to the bottom */}
            </div>
        </div>
    );
};

export default Message;
