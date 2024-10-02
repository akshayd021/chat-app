import React from 'react';
import moment from 'moment';

import { users } from '@/utils/user';

const ResentChat = ({setChat,setShowChat}) => {
    return (
        <div className=" mx-auto ">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-text">Resent Chat</h3>
            </div>
            <div className="overflow-auto scrollbar-hide h-[70vh]">
                <div className="items-center gap-3">
                    {users?.map((user, i) => (
                        <div
                            key={i}
                            onClick={() =>{ setChat(user)
                                setShowChat(false)
                            }}
                            className="relative cursor-pointer flex items-center my-1 rounded-md border-b shadow-sm p-2"
                        >
                            <img
                                src={user?.image || "/assets/user.png"}
                                alt={user?.name?.slice(0, 10)}
                                className="w-12 h-12 border object-cover rounded-full"
                            />
                            {user?.online && (
                                <p className="bg-emerald-500 w-2 h-2 rounded-full absolute left-[46px] border border-white bottom-[15px]"></p>
                            )}
                            <div className="ml-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-black text-sm">
                                        {user?.name?.length > 20 ? `${user.name.slice(0, 20)}...` : user.name}
                                    </p>
                                    <p className="text-text text-sm absolute right-2">
                                        {user?.lastOnline && moment(user.lastOnline).format('DD/MM/YY')}
                                    </p>
                                </div>
                                <p className="text-text text-sm">
                                    {user?.lastMessage?.length > 20 ? `${user.lastMessage.slice(0, 20)}...` : user.lastMessage}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default ResentChat;