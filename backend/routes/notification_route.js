import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getNotifications,
  deleteNotifications,
} from "../controllers/notification_controller.js";
const router = express.Router();

router.get("/getNotifications", protectRoute, getNotifications);

router.delete("/deleteNotifications", protectRoute, deleteNotifications);

export default router;
