import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";
import useFetchLastSeen from "../hooks/useFetchLastSeen"; // Import the custom hook

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext();

  const { usersLastSeen } = useFetchLastSeen(); // Use the custom hook

  useEffect(() => {
    if (authUser) {
      const socket = io("http://localhost:8000", {
        query: {
          userId: authUser._id,
        },
      });

      setSocket(socket);

      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  // Handle loading and error states
  // if (loading) {
  //   return <div>Loading last seen...</div>;
  // }

  // if (error) {
  //   return <div>Error fetching last seen data: {error}</div>;
  // }

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, usersLastSeen }}>
      {children}
    </SocketContext.Provider>
  );
};
