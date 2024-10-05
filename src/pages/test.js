import React from 'react';
import moment from 'moment';
import { useAuth } from '@/context/AuthContext';

const UserList = ({ allUsers }) => {
    const { authUser } = useAuth();

    return (
        <div className="mt-3 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-3 whitespace-nowrap w-full">
                {allUsers.map((user) => (
                    <div key={user._id} className="flex-shrink-0 cursor-pointer relative flex items-center flex-col">
                        <img
                            src={user.image || "/assets/user.png"}
                            alt={user.username}
                            className="w-12 h-12 border object-cover rounded-full"
                        />
                        <p className="text-text text-[12px]">{user.username.slice(0, 6)}..</p>
                        <p className={`text-${user.seen ? 'gray-500' : 'black'} text-[12px]`}>
                            {user.lastMessage || "No messages"}
                        </p>
                        {user.lastMessageTime && (
                            <p className="text-gray-400 text-[10px]">{moment(user.lastMessageTime).fromNow()}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserList;
