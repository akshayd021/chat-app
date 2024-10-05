import { ScreenProvider } from "@/context/ScreenContext";
import { AuthProvider, UserProvider } from "@/context/AuthContext";
import "@/styles/globals.css";
import { SocketProvider } from "@/context/SoketContext";
import { ChatProvider } from "@/context/ChatContext";
import { useState } from "react";


export default function App({ Component, pageProps }) {
  const [receiverId, setReceiverId] = useState(null);

  const handleUserSelect = (userId) => {
    setReceiverId(userId);
  };
  return (
    <AuthProvider>
      <SocketProvider >
        <ChatProvider>
          <ScreenProvider>
            <Component {...pageProps} receiverId={receiverId} onSelectUser={handleUserSelect} />
          </ScreenProvider>
        </ChatProvider>
      </SocketProvider>
    </AuthProvider>

  )
}
