import { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext"; // Assuming this provides user info

const useFriends = () => {
  const { authUser } = useAuthContext();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch friends from backend
  const fetchFriends = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/requests/friends", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch friends");
      }

      const data = await response.json();
      setFriends(data.friends);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching friends:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser) {
      fetchFriends();
    }
  }, [authUser]);

  return { friends, loading, fetchFriends };
};

export default useFriends;
