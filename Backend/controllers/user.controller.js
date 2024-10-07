import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to get users who are not my friends
export const getNonFriends = async (req, res) => {
  try {
    const userId = req.user._id; // Get userId from query parameters
    // console.log(userId);

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Step 1: Fetch the current user with their friends list
    const currentUser = await User.findById(userId)
      .select("friends")
      .populate("friends");
    console.log("Current User:", currentUser);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Step 2: Get all users excluding the current user
    const allUsers = await User.find({ _id: { $ne: userId } }).select(
      "_id fullName profilePic username gender"
    );
    console.log("allUsers:", allUsers);

    // Step 3: Filter out the users who are in the `friends` array of the current user
    const nonFriends = allUsers.filter(
      (user) =>
        !currentUser.friends.some(
          (friend) => friend._id.toString() === user._id.toString()
        )
    );

    return res.status(200).json(nonFriends);
  } catch (error) {
    console.error("Error getting non-friends:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Fetch user details including last seen
export const getUserLastSeen = async (req, res) => {
  try {
    const users = await User.find({}, "_id username lastSeen");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
