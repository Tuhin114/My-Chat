import { useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";
import Header from "../../utils/Header";
import NoChatSelected from "../../utils/NoChatSelected";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import useFriends from "../../hooks/useFriends";
import useConversation from "../../zustand/useConversation";
import useRequestStatus from "../../hooks/useRequestStatus"; // New custom hook

const MessageContainer = () => {
  const { socket } = useSocketContext();
  const { authUser } = useAuthContext();
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { friends, fetchFriends } = useFriends();
  const {
    receivedRequest,
    loading,
    sentRequest,
    isFriend,
    checkReceivedRequests,
    handleAcceptRequest,
    handleSendRequest,
  } = useRequestStatus(
    socket,
    authUser,
    selectedConversation,
    friends,
    fetchFriends
  );

  useEffect(() => {
    if (selectedConversation) {
      checkReceivedRequests();
    }
  }, [authUser._id, selectedConversation, checkReceivedRequests]);

  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  return (
    <div className="md:min-w-[650px] flex flex-col bg-white">
      {!selectedConversation ? (
        <NoChatSelected authUser={authUser} />
      ) : (
        <>
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
