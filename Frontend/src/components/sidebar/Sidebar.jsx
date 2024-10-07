import Friends from "./Friends";
import Conversations from "./Conversations";
import SearchInput from "./SearchInput";
import SideBar_bar from "./SideBar_bar";

import { useState } from "react";

const Sidebar = () => {
  const [selectedIcon, setSelectedIcon] = useState("chat");
  return (
    <div className="sidebar_img border-r border-slate-500 flex flex-col h-full">
      <div className="flex h-full w-96">
        <div className="">
          <SideBar_bar
            selectedIcon={selectedIcon}
            setSelectedIcon={setSelectedIcon}
          />
        </div>
        <div className="bg-gray-100 bg-opacity-20 backdrop-blur-sm rounded-lg shadow-lg h-full w-full flex flex-col">
          <SearchInput />
          <div className="bg-[#513f60] h-[1px] w-full"></div>
          {selectedIcon === "chat" && <Friends />}
          {selectedIcon === "user" && <Conversations />}
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
