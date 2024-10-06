import { useEffect, useState } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";
import Header from "../../utils/Header";
import NoChatSelected from "../../utils/NoChatSelected";
import useFriends from "../../hooks/useFriends";

const MessageContainer = () => {
  const { socket } = useSocketContext();
  const { selectedConversation, setSelectedConversation } = useConversation();
  const [receivedRequest, setReceivedRequest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sentRequest, setSentRequest] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const { authUser } = useAuthContext();
  const { friends, fetchFriends } = useFriends();

  useEffect(() => {
    // Check if the selected conversation is a friend
    if (selectedConversation) {
      const isAlreadyFriend = friends.some(
        (friend) => friend._id === selectedConversation._id
      );
      setIsFriend(isAlreadyFriend);
    }
  }, [friends, selectedConversation]);

  useEffect(() => {
    if (socket) {
      socket.on("requestAccepted", ({ recipientId, senderId }) => {
        console.log("Request Accepted:", recipientId, senderId);
        if (
          authUser._id === senderId &&
          selectedConversation._id === recipientId
        ) {
          setIsFriend(true);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("requestAccepted");
      }
    };
  }, [socket, authUser, selectedConversation]);

  const fetchReceivedRequests = async () => {
    try {
      const response = await fetch("/api/requests/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching received requests:", error);
      return { receivedRequests: [], sentRequests: [] };
    }
  };

  useEffect(() => {
    const checkReceivedRequests = async () => {
      setLoading(true);
      const requests = await fetchReceivedRequests();

      const receivedRequests = requests?.receivedRequests || [];
      const sentRequests = requests?.sentRequests || [];

      const sentRequestExists = sentRequests.some(
        (request) =>
          request.sender === authUser._id &&
          request.recipient === selectedConversation._id
      );

      const receivedRequestExists = receivedRequests.some(
        (request) =>
          request.sender === selectedConversation._id &&
          request.recipient === authUser._id
      );

      setSentRequest(sentRequestExists);
      setReceivedRequest(receivedRequestExists);
      setLoading(false);
    };

    if (selectedConversation) {
      checkReceivedRequests();
    }
  }, [authUser._id, selectedConversation]);

  const handleAcceptRequest = async () => {
    const senderId = selectedConversation._id;
    const recipientId = authUser._id;
    try {
      const response = await fetch("/api/requests/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ senderId, recipientId }),
      });

      if (!response.ok) {
        throw new Error("Failed to accept request");
      }

      const data = await response.json();
      console.log(data.message);

      setReceivedRequest(false);
      setIsFriend(true); // Update isFriend after accepting request

      // Emit event to notify the sender that the friend request was accepted
      socket.emit("requestAccepted", { recipientId, senderId });
      console.log(socket.emit);

      // Fetch updated friend list
      await fetchFriends(); // Refresh friend list after accepting request
      console.log(fetchFriends);
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleSendRequest = async () => {
    const senderId = authUser._id;
    const recipientId = selectedConversation._id;
    try {
      const response = await fetch("/api/requests/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ senderId, recipientId }),
      });

      if (!response.ok) {
        throw new Error("Failed to send request");
      }

      const data = await response.json();
      console.log(data.message);

      setSentRequest(true); // Update sent request state
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  return (
    <div className="md:min-w-[650px] flex flex-col bg-white">
      {!selectedConversation ? (
        <NoChatSelected authUser={authUser} />
      ) : (
        <>
          {/* Header */}
          <Header selectedConversation={selectedConversation} />

          {loading ? (
            <div className="flex items-center justify-center h-full">
              Loading...
            </div>
          ) : isFriend ? (
            <>
              <Messages />
              <MessageInput />
            </>
          ) : receivedRequest ? (
            <button onClick={handleAcceptRequest}>Accept</button>
          ) : sentRequest ? (
            <p>Sent successfully</p>
          ) : (
            <button onClick={handleSendRequest}>Send Request</button>
          )}
        </>
      )}
    </div>
  );
};

export default MessageContainer;
