import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  getNonFriends,
  getUserLastSeen,
  getUsersForSidebar,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);
router.get("/non-friends", protectRoute, getNonFriends);
router.get("/last-seen", protectRoute, getUserLastSeen);

export default router;
