import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import useConversation from "../../zustand/useConversation";
import useGetConversations from "../../hooks/useGetConversations";
import toast from "react-hot-toast";

const SearchInput = () => {
  const [search, setSearch] = useState("");
  const { setSelectedConversation } = useConversation();
  const { conversations } = useGetConversations();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return;
    if (search.length < 3) {
      return toast.error("Search term must be at least 3 characters long");
    }

    const conversation = conversations.find((c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase())
    );

    if (conversation) {
      setSelectedConversation(conversation);
      setSearch("");
    } else toast.error("No such user found!");
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex justify-center items-center my-4"
    >
      <div className="flex items-center bg-[#4c3659] text-gray-400 rounded-md px-2 py-1 w-72">
        <input
          type="text"
          placeholder="Search…"
          className="bg-transparent focus:outline-none placeholder-gray-400 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="h-6 w-6 text-gray-400">
          <IoSearchSharp className="" />
        </button>
      </div>
    </form>
  );
};
export default SearchInput;
