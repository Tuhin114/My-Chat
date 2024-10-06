import mongoose from "mongoose";

// Define the request schema
const requestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", // Reference to the User model (if you have one)
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", // Reference to the User model (if you have one)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined"], // Define the possible statuses
    default: "pending",
  },
});

// Create the model from the schema
const Request = mongoose.model("Request", requestSchema);

export default Request;
