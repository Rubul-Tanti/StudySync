import React, { useEffect, useState, createContext, useContext } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

// Create a Context so we can access socket anywhere
const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

const URL =
  process.env.NODE_ENV === "production"
    ? undefined
    : "https://al-kuran-backend-2.onrender.com";

// const URL =
//   process.env.NODE_ENV === "production"
//     ? undefined
//     : "http://localhost:8000";


export const SocketProvider = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io(URL, {
          transports: ["websocket"], // <--- IMPORTANT
  withCredentials: true,
        auth: { userId: user._id, role: user.role },
      });

      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("✅ Socket connected:", newSocket.id);
      });

      newSocket.on("disconnect", () => {
        console.log("❌ Socket disconnected");
      });

      return () => {
        newSocket.disconnect();
      };
    } else {
      if (socket) socket.disconnect();
      setSocket(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
