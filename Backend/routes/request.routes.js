import express from "express";

import protectRoute from "../middleware/protectRoute.js";
import {
  acceptRequest,
  fetchFriends,
  getReceivedRequests,
  sendRequest,
} from "../controllers/request.controller.js";

const router = express.Router();

router.post("/send", protectRoute, sendRequest);
router.post("/accept", protectRoute, acceptRequest);
router.get("/friends", protectRoute, fetchFriends);
router.get("/get", protectRoute, getReceivedRequests);

export default router;
