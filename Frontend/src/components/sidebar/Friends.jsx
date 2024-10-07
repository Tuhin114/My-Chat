import useFriends from "../../hooks/useFriends";
import { getRandomEmoji } from "../../utils/emojis";
import Conversation from "./Conversation";

const Friends = () => {
  const { loading, friends } = useFriends();
  return (
    <div className="py-2 flex flex-col overflow-auto ">
      {friends.map((conversation, idx) => (
        <Conversation
          key={conversation._id}
          conversation={conversation}
          emoji={getRandomEmoji()}
          lastIdx={idx === friends.length - 1}
        />
      ))}

      {loading ? (
        <span className="loading loading-spinner mx-auto"></span>
      ) : null}
    </div>
  );
};

export default Friends;
