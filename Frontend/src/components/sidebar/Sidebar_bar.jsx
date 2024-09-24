import {
  IoChatbubbleEllipsesOutline,
  IoChatbubbleEllipsesSharp,
  IoSettingsOutline,
  IoSettingsSharp,
} from "react-icons/io5";
import { FaRegUser, FaUser } from "react-icons/fa6";
import LogoutButton from "./LogoutButton";
import { useState } from "react";

const SideBar_bar = () => {
  const [selectedIcon, setSelectedIcon] = useState(null);

  const handleSelect = (icon) => {
    setSelectedIcon(icon);
  };

  return (
    <div className="h-full w-16 flex flex-col items-center py-4">
      {/* My Profile Image */}
      <div className="p-3 mt-4">
        <div className="avatar online">
          <div className="rounded-full">
            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
          </div>
        </div>
      </div>

      <div className="flex flex-col mt-4">
        {/* Chat Icon */}
        <div
          className="hover:bg-gray-100 hover:bg-opacity-20 hover:backdrop-blur-sm hover:shadow-lg cursor-pointer transition-all duration-300 ease-in-out"
          onClick={() => handleSelect(selectedIcon === "chat" ? null : "chat")}
        >
          {selectedIcon === "chat" ? (
            <div className="flex justify-center py-4 px-5 bg-gray-100 bg-opacity-20 backdrop-blur-sm shadow-lg">
              <IoChatbubbleEllipsesOutline size={24} className="text-white" />
            </div>
          ) : (
            <div className="flex justify-center py-4 px-5">
              <IoChatbubbleEllipsesSharp size={24} className="text-[#5a495a]" />
            </div>
          )}
        </div>

        {/* User Icon */}
        <div
          className="hover:bg-gray-100 hover:bg-opacity-20 hover:backdrop-blur-sm hover:shadow-lg cursor-pointer transition-all duration-300 ease-in-out"
          onClick={() => handleSelect(selectedIcon === "user" ? null : "user")}
        >
          {selectedIcon === "user" ? (
            <div className="flex justify-center py-4 px-5 bg-gray-100 bg-opacity-20 backdrop-blur-sm shadow-lg">
              <FaRegUser size={24} className="text-white" />
            </div>
          ) : (
            <div className="flex justify-center py-4 px-5">
              <FaUser size={24} className="text-[#5a495a]" />
            </div>
          )}
        </div>

        {/* Settings Icon */}
        <div
          className="hover:bg-gray-100 hover:bg-opacity-20 hover:backdrop-blur-sm hover:shadow-lg cursor-pointer transition-all duration-300 ease-in-out"
          onClick={() =>
            handleSelect(selectedIcon === "settings" ? null : "settings")
          }
        >
          {selectedIcon === "settings" ? (
            <div className="flex justify-center py-4 px-5 bg-gray-100 bg-opacity-20 backdrop-blur-sm shadow-lg">
              <IoSettingsOutline size={24} className="text-white" />
            </div>
          ) : (
            <div className="flex justify-center py-4 px-5">
              <IoSettingsSharp size={24} className="text-[#5a495a]" />
            </div>
          )}
        </div>
      </div>

      {/* Logout Button */}
      <div className="py-4 px-5 mt-56">
        <div className="flex justify-center">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default SideBar_bar;
