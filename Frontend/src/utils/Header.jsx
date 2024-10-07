import { BsFillInfoCircleFill } from "react-icons/bs";

import { formatLastSeen } from "./extractTime";
import useFetchLastSeen from "../hooks/useFetchLastSeen";
import { useSocketContext } from "../context/SocketContext";
const Header = ({ selectedConversation }) => {
  const { usersLastSeen } = useFetchLastSeen();
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(selectedConversation._id);

  // console.log(usersLastSeen);
  // console.log(selectedConversation);

  const getLastSeenText = (userId) => {
    const user = usersLastSeen.find((u) => u._id === userId);
    console.log(user);
    if (user) {
      return formatLastSeen(user.lastSeen);
    }
    return "Last seen unknown";
  };

  return (
    <div className="border-b-gray-200 border-b-2 h-16 flex items-center justify-between px-4">
      <div className="avatar p-2 ml-2">
        <div className="w-12 rounded-full">
          <img src={selectedConversation.profilePic} alt="user avatar" />
        </div>
      </div>
      <div className="px-2">
        <div className="font-bold text-lg mt-2">
          {selectedConversation.fullName}
        </div>
        <div className="flex items-center gap-1 mb-2">
          {isOnline ? (
            <div className="flex items-center">
              <div className="">Online</div>
              <div className="bg-green-500 w-1 h-1 rounded-full mt-1 ml-1"></div>
            </div>
          ) : (
            getLastSeenText(selectedConversation._id)
          )}
        </div>
      </div>

      <div className="ml-auto px-2">
        <BsFillInfoCircleFill className="text-violet-900 cursor-pointer" />
      </div>
    </div>
  );
};

export default Header;
