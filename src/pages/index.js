

import { ResentChat } from '@/componets';
import { HiSearch } from 'react-icons/hi';
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { useState, useEffect } from 'react';
import { MdAddCall, MdVideoCall, MdOutlineMoreVert, MdEmojiEmotions } from "react-icons/md";
import Message from '@/componets/Message';
import { useScreen } from '@/context/ScreenContext';
import { useSocket } from '@/context/SoketContext';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import moment from 'moment';
import { useRouter } from 'next/router';

export default function Home({ onSelectUser }) {
  const { isDesktop } = useScreen();
  const router = useRouter();
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState('');
  const { authUser } = useAuth();
  const { socket } = useSocket();
  const [chat, setChat] = useState([]);
  const [receiverId, setReceiverId] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(null);
  const [lastMessagesMap, setLastMessagesMap] = useState({});

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get('http://192.168.29.219:5000/api/auth/logged-in-users');
        const filter = response?.data?.filter((x) => x?._id !== authUser?.id);
        setAllUsers(filter);

        const lastMessages = {};
        filter.forEach(user => {
          lastMessages[user._id] = {
            message: user.lastMessage,
            timestamp: user.lastMessageTime,
            unseenCount: user.unseenCount // Assuming this is included in the API response
          };
        });
        setLastMessagesMap(lastMessages);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchAllUsers()
  }, [authUser]);

  useEffect(() => {
    if (socket && authUser) {
      socket.emit('login', authUser.id);

      socket.on('receive-message', (data) => {
        setMessages((prev) => [...prev, data]);

        const lastMessageKey = data.senderId === authUser.id ? data.receiverId : data.senderId;

        setLastMessagesMap((prev) => ({
          ...prev,
          [lastMessageKey]: {
            message: data.message,
            timestamp: data.timestamp,
            seen: false // Assume new messages are unseen
          },
        }));
      });

      // Modify the last message handling to include unseen count
      const countUnseenMessages = async (userId) => {
        const unseenCount = await Message.countDocuments({
          receiverId: userId,
          seenBy: { $nin: [authUser.id] } // Count messages not seen by the user
        });
        return unseenCount;
      };



      socket.on('online-users', (users) => {
        setAllUsers((prevUsers) => {
          return prevUsers.map(user => {
            const onlineStatus = users.includes(user._id);
            return {
              ...user,
              online: onlineStatus,
              lastSeen: onlineStatus ? null : user.lastSeen,
              lastMessage: lastMessagesMap[user._id]?.message || user.lastMessage,
              lastMessageTime: lastMessagesMap[user._id]?.timestamp || user.lastMessageTime, // Add last message time
            };
          });
        });
      });

      socket.on('typing', (senderId) => {
        setIsTyping(senderId);
        setTimeout(() => setIsTyping(null), 1000);
      });

      return () => {
        socket.off('receive-message');
        socket.off('online-users');
        socket.off('typing');
      };
    }
  }, [socket, authUser, lastMessagesMap]);

  const sendMessage = () => {
    if (!authUser || !receiverId || !message) {
      alert("Missing required fields to send message");
      return;
    }

    const timestamp = new Date().toISOString(); // Get current timestamp
    const newMessage = { senderId: authUser.id, receiverId, message, timestamp }; // Include timestamp

    socket.emit('send-message', newMessage);
    setMessages((prev) => [...prev, newMessage]);
    const lastMessageKey = receiverId; // Use receiverId for last message
    setLastMessagesMap((prev) => ({
      ...prev,
      [lastMessageKey]: {
        message: newMessage.message,
        timestamp: timestamp // Add the timestamp here
      },
    }));
    setMessage(''); // Clear message input
  };

  const handleTyping = () => {
    if (receiverId) {
      socket.emit('typing', { senderId: authUser.id, receiverId });
    }
  };

  useEffect(() => {
    const fetchMessageHistory = async () => {
      if (authUser?.id && receiverId) {
        try {
          const response = await axios.get(`http://192.168.29.219:5000/api/messages/history/${authUser.id}/${receiverId}`);
          setMessages(response?.data);
        } catch (error) {
          console.error('Failed to load message history', error);
        }
      }
    };
    fetchMessageHistory();
  }, [authUser?.id, receiverId, lastMessagesMap]);

  return (
    <div>
      <div className="lg:container">
        {!authUser?.id && <div className="text-2xl text-center flex flex-col  my-20 items-center justify-center font-bold">
          <p>  Krupa kari ne Login karo to j tame chat joi sakso </p>
          <p className="inine-flex underline text-lg cursor-pointer mt-10 text-center text-text"
            onClick={() => { router.push(`/login`) }}> Login karva ahiya Click karo </p>
        </div>}

        {authUser?.id &&
          <div className="lg:flex justify-center items-center">
            {((!isDesktop && !showChat) || isDesktop) &&
              <div className="lg:w-[30%] w-full px-2 min-h-screen border-l bg-second">
                <div className="flex justify-between items-center "><h2 className="text-2xl my-3 text-text font-semibold">Chats</h2>
                  {authUser?.id && <p className="inine-flex underline text-sm cursor-pointer mt-2 text-red-500"
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}> Log Out </p>}
                </div>
                <p onClick={() => { router.push(`/profile/${authUser?.id}`) }}>Add Profile </p>
                <div className="flex items-center border-2 mb-3 lg:mb-0 relative bg-white rounded-md w-full">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="py-2 pl-4 text-sm outline-none"
                  />
                  <button className="absolute right-0 text-gray-500 mr-2 hover:text-gray-900 transition duration-300">
                    <HiSearch size={20} />
                  </button>
                </div>
                <div className="mt-3 overflow-x-auto scrollbar-hide">
                  <div className="flex items-center gap-3 whitespace-nowrap w-full">
                    {allUsers.map((user) => {
                      const lastMessageData = lastMessagesMap[user._id] || {};
                      console.log(user, "user")
                      return (
                        <div key={user._id} className="flex-shrink-0 cursor-pointer relative flex items-center flex-col">
                          <img
                            src={user.image || "/assets/user.png"}
                            alt={user.username}
                            className="w-12 h-12 border object-cover rounded-full"
                          />
                          {user.online &&
                            <p className="bg-emerald-500 w-2 h-2 rounded-full absolute right-[5px] border border-white bottom-[20px]"></p>
                          }
                          <p className="text-text text-[12px]">{user.username.slice(0, 6)}..</p>
                          {/* Display last message with appropriate color */}
                          <p className={`text-[12px] ${lastMessageData.seen ? 'text-gray-500' : 'text-red-500'}`}>
                            {lastMessageData.message || 'No messages yet'}
                          </p>
                          {/* Display unseen message count */}
                          {lastMessageData.unseenCount > 0 && (
                            <p className="text-[10px] text-red-500">
                              {lastMessageData.unseenCount} unseen message(s)
                            </p>
                          )}
                          {/* Display last message time */}
                          <p className="text-[10px] text-gray-400">
                            {lastMessageData.timestamp ? moment(lastMessageData.timestamp).format('hh:mm A') : ''}
                          </p>
                        </div>
                      );
                    })}

                  </div>
                </div>

                <div className="mt-0">
                  <ResentChat
                    messages={messages}
                    setReceiverId={setReceiverId}
                    setShowChat={setShowChat}
                    allUsers={allUsers}
                    lastMessagesMap={lastMessagesMap}
                    setChat={setChat}
                  />
                </div>
              </div>}

            {((!isDesktop && showChat) || isDesktop) &&
              <div className="lg:w-[70%] bg-white z-20 border-x min-h-screen relative">
                {chat?.length === 0 && isDesktop ? (
                  <div className="flex flex-col justify-center items-center h-screen">
                    <img
                      src="/assets/chat-1.svg"
                      alt="nothing"
                      className="w-[60%]"
                    />
                    <h2 className="text-text text-3xl mt-5 font-semibold">Start Conversation</h2>
                  </div>
                ) : (
                  <>
                    <div className="sticky top-0 z-40 bg-gray-200 py-2 w-full">
                      <div className="flex justify-between px-4">
                        <div className="flex gap-4 items-center text-black">
                          <FaArrowLeft onClick={() => setShowChat(false)} className="cursor-pointer block lg:hidden" />
                          <img
                            src={chat?.image || "/assets/user.png"}
                            alt={chat?.username?.slice(0, 10)}
                            className="w-8 h-8 md:w-12 md:h-12 border object-cover rounded-full cursor-pointer"
                          />
                          <div className="flex flex-col gap-1">
                            <p className="text-black cursor-pointer text-[12px] md:text-[16px] -ml-1">{chat?.username}</p>
                            {isTyping === chat?._id ? (
                              <p className="text-gray-500 text-sm">Typing...</p>
                            ) : chat?.online ? (
                              <p className="bg-emerald-500 w-2 h-2 rounded-full absolute right-[5px] border border-white bottom-[20px]"></p>
                            ) : (
                              <p className="text-gray-500 text-[12px]">
                                {chat?.lastSeen && moment(chat?.lastSeen).isSame(new Date(), 'day')
                                  ? `Last seen at ${moment(chat?.lastSeen).format('hh:mm A')}`
                                  : chat?.lastSeen ? moment(chat?.lastSeen).format('MMM D') : 'Online'}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-black flex items-center gap-5">
                          <MdAddCall className="text-xl cursor-pointer" />
                          <MdVideoCall className="text-2xl cursor-pointer" />
                          <MdOutlineMoreVert className="text-2xl cursor-pointer" />
                        </div>
                      </div>
                    </div>

                    <div className="middel">
                      <Message messages={messages} />
                    </div>

                    <div className="absolute bottom-0 bg-[#d8dbe0] py-2 w-full">
                      <div className="text-black flex items-center gap-5 px-4">
                        <MdEmojiEmotions className="text-xl cursor-pointer" />
                        <div className="flex items-center relative bg-white rounded-md w-full">
                          <input
                            type="text"
                            value={message}
                            onChange={(e) => {
                              setMessage(e.target.value);
                              handleTyping();
                            }}
                            placeholder="Type a message..."
                            className="py-2 pl-4 w-[92%] text-[14px] outline-none rounded-md"
                          />
                          <button
                            onClick={sendMessage}
                            className="absolute bg-white z-40 right-1 text-text mr-2 hover:text-gray-900 transition duration-300">
                            <FiSend size={21} className="cursor-pointer" />
                          </button>
                        </div>
                        <FaPlus className="text-xl cursor-pointer text-gray-800" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            }
          </div>}
      </div>
    </div>
  );
}
