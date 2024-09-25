import { useEffect } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";
import { BsFillInfoCircleFill } from "react-icons/bs";

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();

  useEffect(() => {
    // cleanup function (unmounts)
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  return (
    <div className="md:min-w-[650px] flex flex-col bg-white">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          {/* Header */}
          <div className="border-b-gray-200 border-b-2 h-16 flex items-center justify-between px-4">
            <div className="avatar p-2 ml-2">
              <div className="w-12 rounded-full">
                <img src={selectedConversation.profilePic} alt="user avatar" />
              </div>
            </div>
            <div className="px-2">
              <div className="font-bold text-lg mt-2">
                {" "}
                {/* Reduced margin-top */}
                {selectedConversation.fullName}
              </div>
              <div className="flex items-center gap-1 mb-2">
                {" "}
                {/* Reduced margin-bottom */}
                <div className="text-sm">Online</div>
                <div className="bg-green-500 w-1 h-1 rounded-full mt-1"></div>
              </div>
            </div>

            <div className="ml-auto px-2">
              <BsFillInfoCircleFill className="text-violet-900 cursor-pointer" />
            </div>
          </div>
          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  );
};
export default MessageContainer;

const NoChatSelected = () => {
  const { authUser } = useAuthContext();
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
        <p>Welcome 👋 {authUser.fullName} ❄</p>
        <p>Select a chat to start messaging</p>
        <TiMessages className="text-3xl md:text-6xl text-center" />
      </div>
    </div>
  );
};
