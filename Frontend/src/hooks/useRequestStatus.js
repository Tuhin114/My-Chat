import { useState, useEffect, useCallback } from "react";

const useRequestStatus = (
  socket,
  authUser,
  selectedConversation,
  friends,
  fetchFriends
) => {
  const [receivedRequest, setReceivedRequest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sentRequest, setSentRequest] = useState(false);
  const [isFriend, setIsFriend] = useState(false);

  // Check if the selected conversation is a friend
  useEffect(() => {
    if (selectedConversation) {
      const isAlreadyFriend = friends.some(
        (friend) => friend._id === selectedConversation._id
      );
      setIsFriend(isAlreadyFriend);
    }
  }, [friends, selectedConversation]);

  // Listen to socket for "requestAccepted"
  useEffect(() => {
    if (socket) {
      socket.on("requestAccepted", ({ recipientId, senderId }) => {
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

  const checkReceivedRequests = useCallback(async () => {
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

      setReceivedRequest(false);
      setIsFriend(true);

      // Notify the sender
      socket.emit("requestAccepted", { recipientId, senderId });

      // Refresh friend list
      await fetchFriends();
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

      setSentRequest(true);
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  return {
    receivedRequest,
    loading,
    sentRequest,
    isFriend,
    setIsFriend,
    checkReceivedRequests,
    handleAcceptRequest,
    handleSendRequest,
  };
};

export default useRequestStatus;
