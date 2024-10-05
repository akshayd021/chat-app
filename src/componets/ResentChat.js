
import moment from 'moment';

const ResentChat = ({ setChat, setShowChat, allUsers, setReceiverId,lastMessagesMap }) => {

    return (
        <div className="mx-auto">
            <div className="my-3">
                <h3 className="text-lg font-semibold text-text">Recent Chat</h3>
            </div>
            <div className="overflow-auto scrollbar-hide h-[69vh]">
                <div className="items-center gap-3">
                    {allUsers?.map((user, i) => (
                        <div
                            key={i}
                            onClick={() => {
                                setChat(user);
                                setShowChat(true);
                                setReceiverId(user?._id);
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
                                {user?.lastMessage && <p className={`text-[12px] ${lastMessagesMap[user._id]?.seen ? 'text-gray-500' : 'text-red-500'}`}>
                          {lastMessagesMap[user._id]?.message || 'No messages yet'}
                        </p>}
                                {console.log("user", user)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResentChat;
