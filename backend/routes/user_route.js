import express from "express"
import { protectRoute } from "../middleware/protectRoute.js";
import { getUserProfile, followUnfollowUser,getSuggestedUser,updateUser } from "../controllers/user_controller.js"

const Router = express.Router();

Router.get("/profile/:username", protectRoute, getUserProfile)
Router.get("/suggested", protectRoute, getSuggestedUser)
Router.post("/follow/:id", protectRoute, followUnfollowUser)
Router.post("/update", protectRoute, updateUser)

export default Router
