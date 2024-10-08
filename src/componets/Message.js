import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import moment from 'moment';

const Message = ({ messages }) => {
    const messageEndRef = useRef(null);
    const { authUser } = useAuth();


    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);





    return (
        <div className="w-full absolute bottom-7 p-4 lg:h-[90vh] h-[90vh] overflow-hidden rounded-lg">
            <div className="space-y-4 flex flex-col h-full overflow-y-auto scrollbar-hide">
                {/* {messages?.map((chat) => (
                //     <div
                //         key={chat._id}
                //         className={`flex ${chat.senderId !== authUser?.id ? "justify-start" : "justify-end"}`}
                //     >
                //         <div className={`flex items-center space-x-2 ${chat.senderId !== authUser?.id ? "mr-2" : "ml-2"}`}>
                //             {chat.senderId !== authUser?.id ? (
                //                 <div className="bg-[#F3F4F6] text-black p-2 rounded-lg max-w-xs">
                //                     <p className="px-1 wrap-text">{chat.message}</p>
                //                     <p className="text-xs text-right text-text">
                //                         {new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                //                     </p>
                //                 </div>
                //             ) : (
                //                 <div className="bg-[#0F57FF] text-white p-2 rounded-lg max-w-xs">
                //                     <p className="px-1 wrap-text">{chat.message}</p>
                //                     <p className="text-xs text-right text-gray-00">
                //                         {new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                //                     </p>
                //                 </div>
                //             )}
                //         </div>


                //     </div>
                // ))} */}
                {messages?.map((chat) => (
                    <div
                        key={chat._id}
                        className={`flex ${chat.senderId !== authUser?.id ? "justify-start" : "justify-end"}`}
                    >
                        <div className={`flex items-center space-x-2 ${chat.senderId !== authUser?.id ? "mr-2" : "ml-2"}`}>
                            {chat.senderId !== authUser?.id ? (
                                <div className="bg-[#F3F4F6] text-black p-2 rounded-lg max-w-xs">
                                    {console.log("image-type", JSON.stringify(chat))}
                                    {chat.type === 'image' ? (
                                        <img
                                            src={chat.message} // This should now be the full URL
                                            alt="sent"
                                            style={{ maxWidth: '100%', borderRadius: '5px' }}
                                        />
                                    ) : (
                                        <p>{chat.message}</p>
                                    )}
                                    <p className="text-xs text-right text-text">
                                        {new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {/* {chat?.receiverId === chat?.seenBy?.[0] ? " (Seen)" : ""} */}
                                    </p>

                                </div>
                            ) : (
                                <div className="bg-[#0F57FF] text-white p-2 rounded-lg max-w-xs">
                                    {chat?.type === 'image' ? (
                                        <img src={chat?.message} alt="sent" style={{ maxWidth: '100%', borderRadius: '5px' }} />
                                    ) : (
                                        <p>{chat?.message}</p>
                                    )}
                                    <p className="text-xs text-right text-gray-00">
                                        {new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {chat?.receiverId === chat?.seenBy?.[0] ? " (Seen)" : "sent"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                ))}


                <div ref={messageEndRef} />
            </div>
        </div>
    );
};

export default Message;
