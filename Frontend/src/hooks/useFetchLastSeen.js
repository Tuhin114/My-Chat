import { useState, useEffect } from "react";

const useFetchLastSeen = () => {
  const [usersLastSeen, setUsersLastSeen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLastSeenUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/users/last-seen", {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch last seen users");
        }
        const data = await response.json();
        // console.log(data);
        setUsersLastSeen(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLastSeenUsers();
  }, []);

  return { usersLastSeen, loading, error };
};

export default useFetchLastSeen;
