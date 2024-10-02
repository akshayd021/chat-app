import { ResentChat } from '@/componets';
import { users } from '@/utils/user';
import { HiSearch } from 'react-icons/hi';
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { useState } from 'react';
import { MdAddCall, MdVideoCall, MdOutlineMoreVert, MdEmojiEmotions } from "react-icons/md";
import Message from '@/componets/Message';
import { useScreen } from '@/context/ScreenContext';


export default function Home() {
  const { isMobile, isTablet, isDesktop } = useScreen();
  const [showChat, setShowChat] = useState(true)
  const [showMsg, setShowMsg] = useState(false)
  const [chat, setChat] = useState([])
  return (
    <div>
      {isMobile && <p>This is a mobile view.</p>}
      {isTablet && <p>This is a tablet view.</p>}
      {isDesktop && <p>This is a desktop view.</p>}
      <div className="lg:container">
        <div className="lg:flex justify-center items-center">
          <div className="lg:w-[30%]  w-full px-2 min-h-screen border-l bg-second">
            <h2 className="text-2xl my-3 text-text font-semibold">Chats</h2>
            <div className="flex items-center border-2 mb-3 lg:mb-0 relative bg-white rounded-md w-full">
              <input
                type="text"
                placeholder="Search..."
                className=" py-2 pl-4 text-sm outline-none"
              />
              <button className="absolute right-0 text-gray-500 mr-2 hover:text-gray-900 transition duration-300">
                <HiSearch size={20} />
              </button>
            </div>
            <div className="my-3 overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-3 whitespace-nowrap w-full">
                {users?.map((user, i) => (
                  <div onClick={() => setChat(user)} key={i} className="flex-shrink-0 cursor-pointer relative flex items-center flex-col">
                    <img
                      src={user?.image || "/assets/user.png"}
                      alt={user?.name?.slice(0, 10)}
                      className="w-12 h-12 border object-cover rounded-full"
                    />
                    {user?.online && (
                      <p className="bg-emerald-500 w-2 h-2 rounded-full absolute right-[5px] border border-white bottom-[20px]"></p>
                    )}
                    <p className="text-text text-[12px]">{user?.name?.slice(0, 6)}..</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="my-5">
              <ResentChat chat={chat} setChat={setChat} setShowChat={setShowChat} />
            </div>
          </div>

          <div className="lg:w-[70%] bg-white border-l min-h-screen relative" style={{
            // backgroundImage: "url('/assets/ab.png')",
            // backgroundSize: "contain", // This will ensure the image covers the entire div
            // backgroundPosition: "center" // This will center the image
          }}>
            {chat?.length === 0 && isDesktop ? (
              <div className="flex flex-col justify-center items-center h-screen">
                <img
                  src="/assets/start-con.png"
                  alt="nothing"
                  className="w-80"
                />
                <h2 className="text-text text-2xl mt-5 font-semibold ">Start Conversasion</h2>
              </div>) :

              <>
                <div className="sticky top-0 bg-gray-200 py-2 w-full">
                  <div className="flex justify-between px-4">
                    <div className="flex gap-4  items-center text-black">
                      <FaArrowLeft onClick={() => setChat([])} className="cursor-pointer" />
                      <img
                        src={chat?.image || "/assets/user.png"}
                        alt={chat?.name?.slice(0, 10)}
                        className="w-10 h-10 border object-cover rounded-full cursor-pointer"
                      />

                      <div className="flex flex-col gpa-1">
                        <p className="text-black cursor-pointer text-[16px] -ml-1">{chat?.name}</p>
                        <p className="text-black text-[12px] -ml-1">{chat?.online ? "Online" : "Offline"}</p>
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
                  <Message />
                </div>


                <div className="absolute bottom-0 bg-[#d8dbe0] py-2 w-full" >
                  <div className="text-black flex items-center juce gap-5 px-4">
                    <MdEmojiEmotions className="text-xl cursor-pointer" />

                    <div className="flex items-center relative bg-white  rounded-md w-full">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className=" py-2 pl-4 text-[14px] outline-none  rounded-md"
                      />
                      <button className="absolute right-1 text-text  mr-2 hover:text-gray-900 transition duration-300">
                        <FiSend size={21} className="cursor-pointer" />
                      </button>
                    </div>
                    <FaPlus className="text-xl cursor-pointer text-gray-800" />

                  </div>
                </div>
              </>}
          </div>
        </div>

      </div>
    </div>

  );
}
