import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createPost,
  deletePost,
  commentOnPost,
  deleteCommentOnPost,
  likeUnlikePost,
  getAllPosts,
  getUserLikedPost,
  getFollowingPosts,
  getUserPosts
} from "../controllers/post_controller.js";
const router = express.Router();

router.get("/getPosts", protectRoute, getAllPosts);
router.get("/getUserPosts/:username", protectRoute, getUserPosts);
router.get("/getFollowingPosts", protectRoute, getFollowingPosts);
router.get("/userLikedPosts/:id", protectRoute, getUserLikedPost);
router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.delete("/delete/:id", protectRoute, deletePost);
router.delete(
  "/delete/comment/:postId/:commentId",
  protectRoute,
  deleteCommentOnPost,
);

export default router;
