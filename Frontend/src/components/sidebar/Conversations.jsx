import useGetNonFriends from "../../hooks/useGetNonFriends";
import { getRandomEmoji } from "../../utils/emojis";
import Conversation from "./Conversation";

const Conversations = () => {
  const { loading, nonfriends } = useGetNonFriends();
  return (
    <div className="py-2 flex flex-col overflow-auto ">
      {nonfriends.map((conversation, idx) => (
        <Conversation
          key={conversation._id}
          conversation={conversation}
          emoji={getRandomEmoji()}
          lastIdx={idx === nonfriends.length - 1}
        />
      ))}

      {loading ? (
        <span className="loading loading-spinner mx-auto"></span>
      ) : null}
    </div>
  );
};
export default Conversations;
