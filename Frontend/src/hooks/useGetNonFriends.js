import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useGetNonFriends = () => {
  const [loading, setLoading] = useState(false);
  const [nonfriends, setNonfriends] = useState([]);

  useEffect(() => {
    const getNonFriends = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users/non-friends");
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setNonfriends(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getNonFriends();
  }, []);

  return { loading, nonfriends };
};
export default useGetNonFriends;
