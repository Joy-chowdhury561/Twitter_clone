import express from "express"
import {getNotifications,deleteNotifications} from "../controllers/notification_controller.js"
const router =express.Router();

router.get("/getNotifications",getNotification)

router.delete("/deleteNotifications/:id",deleteNotifications)

export default router