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
            <div className="flex flex-col items-center justify-center p-4 ">
              <p className="text-center text-gray-800 font-semibold">
                {selectedConversation.fullName} has send you a message request.
              </p>
              <p className="text-center text-gray-500 ">
                Please accept the request to start chatting!
              </p>
              <button
                className="px-6 py-2 bg-violet-500 text-white font-medium rounded-md shadow hover:bg-violet-900 transition duration-300 ease-in-out"
                onClick={handleAcceptRequest}
              >
                Accept
              </button>
            </div>
          ) : sentRequest ? (
            <div className="flex flex-col items-center justify-center p-6 ">
              <p className="text-center text-violet-300">
                Please wait for the receiver to accept your message request.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-4 ">
              <p className="text-center text-gray-800 font-semibold text-lg mb-4">
                You are not friends yet. Send a message request to start
                chatting!
              </p>
              <button
                onClick={handleSendRequest}
                className="px-6 py-2 bg-violet-500 text-white font-medium rounded-md shadow hover:bg-violet-900 transition duration-300 ease-in-out"
              >
                Send Request
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MessageContainer;
