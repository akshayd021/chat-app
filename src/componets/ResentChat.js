
import moment from 'moment';

const ResentChat = ({ setChat, setShowChat, allUsers, setReceiverId, lastMessagesMap, selectChat, authUser }) => {

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
                                    <p className={`text-[12px] ${user?.receiverId === user?.seenBy?.[0]?.length > 0  ? 'text-red-500' : 'text-gray-500'}`}>
                                        {lastMessageData.message || 'No messages yet'}
                                    </p>
                                    {/* {lastMessageData.unseenCount > 0 && (
                                        <p className="text-[10px] text-red-500">
                                            {authUser?.id ? "" : `${lastMessageData.unseenCount} "unseen Message"`}
                                        </p>
                                    )} */}
                                    {!user?.receiverId === user?.seenBy?.[0].length}
                                    <p className="text-[10px] text-gray-400">
                                        {lastMessageData.timestamp ? moment(lastMessageData.timestamp).format('hh:mm A') : ''}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default ResentChat;
