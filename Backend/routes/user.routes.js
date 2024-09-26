import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  getUserLastSeen,
  getUsersForSidebar,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);
router.get("/last-seen", protectRoute, getUserLastSeen);

export default router;
