import User from "../models/user.model.js";
import Request from "../models/request.model.js";
import { notifySenderRequestAccepted } from "../socket/socket.js";

export const sendRequest = async (req, res) => {
  try {
    const { senderId, recipientId } = req.body;

    // Validate sender existence
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    // Validate recipient existence
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Check if sender and recipient are already friends
    if (sender.friends.includes(recipientId)) {
      return res.status(400).json({ message: "You are already friends" });
    }

    // Check for existing pending request
    const existingRequest = await Request.findOne({
      sender: senderId,
      recipient: recipientId,
      status: "pending",
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "A connection request already exists" });
    }

    await User.findByIdAndUpdate(sender, {
      $addToSet: { sentRequest: recipientId },
    });
    await User.findByIdAndUpdate(recipient, {
      $addToSet: { receivedRequest: senderId },
    });

    // Create a new request with a status
    const newRequest = new Request({
      sender: senderId,
      recipient: recipientId,
      status: "pending", // Set initial status
    });

    await newRequest.save();

    res.status(201).json({ message: "Connection request sent successfully" });
  } catch (error) {
    console.error("Error sending connection request:", error); // Log error for debugging
    res.status(500).json({ message: "Server error" });
  }
};

export const getReceivedRequests = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you're using middleware to set the authenticated user's ID

    // Fetch all received requests for the authenticated user
    const receivedRequests = await Request.find({
      recipient: userId,
      status: "pending", // Only fetch pending requests
    });

    // Fetch all sent requests for the authenticated user
    const sentRequests = await Request.find({
      sender: userId,
      status: "pending", // Only fetch pending requests
    });

    // Send both received and sent requests as a single response object
    res.status(200).json({
      receivedRequests,
      sentRequests,
    });
  } catch (error) {
    console.error("Error fetching received requests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export // Accept Request
const acceptRequest = async (req, res) => {
  const { senderId, recipientId } = req.body;

  try {
    // Step 1: Find the friend request by sender and recipient IDs
    const friendRequest = await Request.findOne({
      sender: senderId,
      recipient: recipientId,
      status: "pending",
    });

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Step 2: Add both users to each other's friend lists
    await User.findByIdAndUpdate(senderId, {
      $addToSet: { friends: recipientId },
    });

    await User.findByIdAndUpdate(recipientId, {
      $addToSet: { friends: senderId },
    });

    // Step 3: Delete the friend request after acceptance
    await Request.findOneAndDelete({
      sender: senderId,
      recipient: recipientId,
    });

    notifySenderRequestAccepted(senderId, recipientId);

    // Step 4: Return a success response
    return res
      .status(200)
      .json({ message: "Friend request accepted successfully" });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const fetchFriends = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user is authenticated and their ID is stored in req.user._id

    // Find the user and populate their friends list
    const user = await User.findById(userId).populate(
      "friends",
      "fullName profilePic"
    ); // Adjust field names as needed

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ friends: user.friends });
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ error: "Server error" });
  }
};
