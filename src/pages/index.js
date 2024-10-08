import { HiSearch } from 'react-icons/hi';
import { FaArrowLeft, FaCamera, FaPhotoVideo, FaPlus } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { useState, useEffect } from 'react';
import { MdAddCall, MdVideoCall, MdOutlineMoreVert, MdEmojiEmotions } from "react-icons/md";
import { useScreen } from '@/context/ScreenContext';
import { useSocket } from '@/context/SoketContext';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import moment from 'moment';
import { useRouter } from 'next/router';
import { ResentChat } from '@/componets';
import Message from '@/componets/Message';

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
  const [isModalOpen, setModalOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };


 const uploadImage = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
        const response = await axios.post('http://192.168.29.219:5000/api/img', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const imageUrl = response.data.url;

        const newMessage = {
            senderId: authUser.id,
            receiverId,
            message: imageUrl,
            timestamp: new Date().toISOString(),
            seenBy: [],
            type: 'image', // Set the type to 'image'
        };

        // Send the message through the socket
        socket.emit('send-message', newMessage);

        // Optionally, add the new message to your local state
        setMessages((prev) => [...prev, newMessage]);
        setLastMessagesMap((prev) => ({
            ...prev,
            [receiverId]: {
                ...prev[receiverId],
                unseenCount: (prev[receiverId]?.unseenCount || 0) + 1,
            },
        }));

        setSelectedFile(null);
        toggleModal();
    } catch (error) {
        console.error('Error uploading image:', error);
    }
};






  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  useEffect(() => {
    const fetchAllUsers = async () => {
      if (!authUser?.id) {
        console.error('User is not authenticated or ID is missing');
        return;
      }

      try {
        const response = await axios.get('http://192.168.29.219:5000/api/auth/logged-in-users');
        const filter = response?.data?.filter((x) => x?._id !== authUser.id);

        if (!filter) {
          console.error('No users found or filter failed');
          return;
        }

        setAllUsers(filter);
        const lastMessages = {};

        await Promise.all(filter.map(async (user) => {
          const messageHistoryResponse = await axios.get(`http://192.168.29.219:5000/api/messages/history/${authUser.id}/${user._id}`);
          const messages = messageHistoryResponse?.data;

          if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            const unseenCount = messages.filter(msg => !msg.seenBy.includes(authUser.id)).length;

            lastMessages[user._id] = {
              message: lastMessage.message,
              timestamp: lastMessage.createdAt,
              unseenCount: unseenCount,
            };
          } else {
            lastMessages[user._id] = {
              message: "No messages yet",
              timestamp: new Date(),
              unseenCount: 0,
            };
          }
        }));

        setLastMessagesMap(lastMessages);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (authUser) {
      fetchAllUsers();
    }
  }, [authUser]);

  useEffect(() => {
    if (socket && authUser) {
      socket.emit('login', authUser.id);

      const handleReceiveMessage = (data) => {

        setMessages((prev) => {
          const updatedMessages = [...prev, data];
          const lastMessageKey = data.senderId === authUser.id ? data.receiverId : data.senderId;

          setLastMessagesMap((prev) => ({
            ...prev,
            [lastMessageKey]: {
              message: data.message,
              timestamp: data.timestamp,
              unseenCount: (prev[lastMessageKey]?.unseenCount || 0) + 1,
            },
          }));

          return updatedMessages;
        });
      };


      const handleOnlineUsers = (users) => {
        setAllUsers((prevUsers) => {
          return prevUsers.map(user => {
            const onlineStatus = users.includes(user._id);
            return {
              ...user,
              online: onlineStatus,
              lastSeen: onlineStatus ? null : user.lastSeen,
              lastMessage: lastMessagesMap[user._id]?.message || user.lastMessage,
              lastMessageTime: lastMessagesMap[user._id]?.timestamp || user.lastMessageTime,
            };
          });
        });
      };

      const handleTyping = (senderId) => {
        setIsTyping(senderId);
        setTimeout(() => setIsTyping(null), 1000);
      };

      const handleDisconnect = async () => {
        if (authUser) {
          await axios.put(`http://192.168.29.219:5000/api/auth/user/${authUser.id}`, { lastSeen: new Date() });
        }
      };

      socket.on('message-seen', ({ senderId }) => {
        setMessages((prev) => {
          return prev.map((msg) => {
            if (msg.senderId === senderId && !msg.seenBy.includes(authUser.id)) {
              return {
                ...msg,
                seenBy: [...msg.seenBy, authUser.id],
              };
            }
            return msg;
          });
        });
      });
      // socket.on('receive-message', (data) => {
      //   console.log('Received message:', data); // Log the received message
      //   handleReceiveMessage(data);
      // });
      socket.on('receive-message', handleReceiveMessage);
      socket.on('online-users', handleOnlineUsers);
      socket.on('typing', handleTyping);
      socket.on('disconnect', handleDisconnect);

      return () => {
        socket.off('receive-message', handleReceiveMessage);
        socket.off('online-users', handleOnlineUsers);
        socket.off('typing', handleTyping);
        socket.off('disconnect', handleDisconnect);
      };
    }
  }, [socket, authUser]);

  const sendMessage = async () => {
    if (!authUser || !receiverId || !message) {
      alert("Missing required fields to send message");
      return;
    }

    const timestamp = new Date().toISOString();
    const newMessage = {
      senderId: authUser.id,
      receiverId,
      message,
      timestamp,
      seenBy: [],
    };

    socket.emit('send-message', newMessage);

    setMessages((prev) => [...prev, newMessage]);

    setLastMessagesMap((prev) => ({
      ...prev,
      [receiverId]: {
        ...prev[receiverId],
        unseenCount: (prev[receiverId]?.unseenCount || 0) + 1,
      },
    }));

    setMessage('');
  };

  const fetchMessageHistory = async (userId) => {
    if (!authUser || !userId) return;

    try {
        const response = await axios.get(`http://192.168.29.219:5000/api/messages/history/${authUser.id}/${userId}`);
        const fetchedMessages = response.data.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
        }));
        console.log('Fetched messages:', fetchedMessages); // Check the structure here

        setMessages(fetchedMessages);
        await markMessagesAsSeen(userId);
    } catch (error) {
        console.error('Failed to load message history', error);
    }
};


  useEffect(() => {
    fetchMessageHistory(receiverId);
  }, [receiverId, authUser]);

  const selectChat = async (userId) => {
    setReceiverId(userId);
    setShowChat(true);
    await fetchMessageHistory(userId);
  };

  const markMessagesAsSeen = async (userId) => {
    try {
      await axios.post(`http://192.168.29.219:5000/api/messages/mark-seen`, {
        userId,
        senderId: authUser?.id,
      });

      setLastMessagesMap((prev) => ({
        ...prev,
        [userId]: {
          ...prev[userId],
          unseenCount: 0,
        },
      }));
    } catch (error) {
      console.error('Failed to mark messages as seen:', error);
    }
  };

  const handleTyping = () => {
    if (receiverId) {
      socket.emit('typing', { senderId: authUser.id, receiverId });
    }
  };


  return (
    <div>
      <div className="lg:container">
        {!authUser?.id && (
          <div className="text-2xl text-center flex flex-col my-20 items-center justify-center font-bold">
            <p>Krupa kari ne Login karo to j tame chat joi sakso</p>
            <p
              className="inine-flex underline text-lg cursor-pointer mt-10 text-center text-text"
              onClick={() => { router.push(`/login`) }}
            >
              Login karva ahiya Click karo
            </p>
          </div>
        )}

        {authUser?.id && (
          <div className="lg:flex justify-center items-center">
            {((!isDesktop && !showChat) || isDesktop) && (
              <div className="lg:w-[30%] w-full px-2 min-h-screen border-l bg-second">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl my-3 text-text font-semibold">Chats</h2>
                  {authUser?.id && (
                    <p
                      className="inine-flex underline text-sm cursor-pointer mt-2 text-red-500"
                      onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                      }}
                    >
                      Log Out
                    </p>
                  )}
                </div>
                <p onClick={() => { router.push(`/profile/${authUser?.id}`) }}>Add Profile</p>
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
                      const lastMessageData = lastMessagesMap[user?._id] || {};
                      return (
                        <div key={user._id} className="flex-shrink-0 cursor-pointer relative flex items-center flex-col" onClick={() => selectChat(user._id)}>
                          <img
                            src={user.image || "/assets/user.png"}
                            alt={user.username}
                            className="w-12 h-12 border object-cover rounded-full"
                          />
                          {user.online && (
                            <p className="bg-emerald-500 w-2 h-2 rounded-full absolute right-[5px] border border-white bottom-[20px]"></p>
                          )}
                          <p className="text-text text-[12px]">
                            {user?.username?.length > 20 ? `${user.username.slice(0, 20)}...` : user.username}
                          </p>

                          {/* {lastMessageData.unseenCount > 0 && (
                            <p className="text-[10px] text-red-500">
                              {lastMessageData?.unseenCount} unseen Message
                            </p>
                          )} */}
                          {/* {!user?.receiverId === user?.seenBy?.[0].length}
                          {console.log(!user?.receiverId === user?.seenBy?.[0].length)}
                          <p className="text-[10px] text-gray-400">
                            {lastMessageData.timestamp ? moment(lastMessageData.timestamp).format('hh:mm A') : ''}
                          </p> */}
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
                    selectChat={selectChat}
                    authUser={authUser
                    }
                  // markMessagesAsSeen={markMessagesAsSeen}
                  />
                </div>
              </div>
            )}

            {((!isDesktop && showChat) || isDesktop) && (
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
                            ) : !chat?.lastSeen ? (
                              <p className="text-emerald-500 text-sm">Online</p>
                            ) : (
                              <p className="text-gray-500 text-[12px]">
                                {chat?.lastSeen && moment(chat?.lastSeen).isSame(new Date(), 'day')
                                  ? `Last seen at ${moment(chat?.lastSeen).format('hh:mm A')}`
                                  : chat?.lastSeen ? moment(chat?.lastSeen).format('hh:mm A', 'MMM D') : 'Online'}
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

                    <div className="middle">
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
                        <div className="relative">
                          <FaPlus
                            className="text-xl cursor-pointer text-gray-800"
                            onClick={toggleModal}
                          />

                          {isModalOpen && (
                            <div className="fixed bottom-5 right-3 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
                              <div className="bg-white p-6 rounded-lg shadow-lg w-[20vw] mx-auto z-60">
                                <button onClick={toggleModal} className="mt-4 bg-blue-500 text-white py-2 px-4 absolute right-1 top-1 rounded hover:bg-blue-600">
                                  Close
                                </button>
                                <h2 className="text-sm font-semibold">Upload an Image</h2>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="mt-2" />
                                <button onClick={uploadImage} className="bg-blue-500 text-white py-1 px-3 rounded mt-2">
                                  Send
                                </button>
                              </div>
                            </div>
                          )}

                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
