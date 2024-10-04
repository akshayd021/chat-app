import { ScreenProvider } from "@/context/ScreenContext";
import { AuthProvider, UserProvider } from "@/context/AuthContext";
import "@/styles/globals.css";
import { SocketProvider } from "@/context/SoketContext";
import { ChatProvider } from "@/context/ChatContext";
import { useState } from "react";
import Chat from "./test";
import OnlineUsers from "./chat";

export default function App({ Component, pageProps }) {
  const [receiverId, setReceiverId] = useState(null);

  const handleUserSelect = (userId) => {
    console.log('Selected User ID:', userId); // Debugging line
    setReceiverId(userId);
};
  return (
    <AuthProvider>
      <SocketProvider >
        <ChatProvider>
          <ScreenProvider>
            <Component {...pageProps} />
            {/* <OnlineUsers  /> */}
             <Chat receiverId={receiverId} onSelectUser={handleUserSelect} />
          </ScreenProvider>
        </ChatProvider>
      </SocketProvider>
    </AuthProvider>

  )
}
