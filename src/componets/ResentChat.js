
import moment from 'moment';
import ImageModal from './ImageModel';
import { useState } from 'react';

const ResentChat = ({ setChat, setShowChat, allUsers, setReceiverId, lastMessagesMap, selectChat, authUser }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const openModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage('');
    };

    return (
        <div className="mx-auto">
            <div className="my-3">
                <h3 className="text-lg font-semibold text-text">Recent Chat</h3>
            </div>
            <div className="overflow-auto scrollbar-hide h-[69vh]">
                <div className="items-center gap-3">
                    {allUsers?.map((user, i) => {
                        const lastMessageData = lastMessagesMap[user._id] || {};
                        return (
                            <div
                                key={i}
                                onClick={() => {
                                    setChat(user);
                                    setShowChat(true);
                                    setReceiverId(user?._id);
                                    selectChat(user?._id)
                                }}
                                className="relative cursor-pointer flex items-center my-1 rounded-md border-b shadow-sm p-2"
                            >
                                <img
                                    src={user?.image || "/assets/user.png"}
                                    alt={user?.username?.slice(0, 10)}
                                    className="w-12 h-12 border object-cover rounded-full"
                                    onClick={() => openModal(user?.image)}
                                />
                                {user?.online && (
                                    <p className="bg-emerald-500 w-2 h-2 rounded-full absolute left-[46px] border border-white bottom-[15px]"></p>
                                )}
                                <div className="ml-4">
                                    <div className="flex justify-between items-center">
                                        <p className="text-black text-sm">
                                            {user?.username?.length > 20 ? `${user.username.slice(0, 20)}...` : user.username}
                                        </p>
                                        <p className="text-text text-sm absolute right-2">
                                            {user?.online && moment(user.online).format('DD/MM/YY')}
                                        </p>

                                    </div>
                                    {console.log(lastMessageData, "msg")}
                                    <p className={`text-[12px] ${user?.seenBy?.[0]?.length > 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                        {lastMessageData?.message?.includes("http://192.168.29.219:5000/uploads/") ? ` Sent a Photo ` : lastMessageData?.message?.length > 35 ? ` ${lastMessageData?.message.slice(0, 35)}...` : lastMessageData?.message}
                                    </p>
                                    {/* {lastMessageData.unseenCount > 0 && (
                                        <p className="text-[10px] text-red-500">
                                            {authUser?.id ? "" : `${lastMessageData.unseenCount} "unseen Message"`}
                                        </p>
                                    )} */}

                                    <p className="text-[10px] text-gray-400">
                                        {lastMessageData.timestamp ? moment(lastMessageData.timestamp).format('hh:mm A') : ''}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                    <ImageModal isOpen={isModalOpen} onClose={closeModal} imageUrl={selectedImage} />
                </div>
            </div>
        </div>
    );
};

export default ResentChat;
