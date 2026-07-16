import User from "../models/user_model.js";
import Post from "../models/post_model.js";
import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notification_model.js";
export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    if (!text && !img) {
      return res.status(400).json({ message: "post must have text or image" });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }
    const newPost = new Post({
      user: req.user._id,
      text,
      img,
    });

    if (newPost) {
      await newPost.save();
      return res
        .status(201)
        .json({ success: true, message: "the post was created" });
    }
  } catch (error) {
    console.log("the error in creating post is", error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "you are not authorized for deleting this post" });
    }
    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ message: "the post was deleted successfully" });
  } catch (error) {
    console.log("the error in deleting post was ", error || error.message);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    if (!text) {
      return res.status(400).json({ message: "please provide a text" });
    }
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }

    post.comments.push({ user: req.user._id, text });

    await post.save();

    const postOwner = post.user;

    const newNotification = new Notification({
      type: "comment",
      from: req.user._id,
      to: postOwner,
    });
    await newNotification.save();

    return res.status(200).json({ message: "your comment was posted" });
  } catch (error) {
    console.log("the error in commenting on post is", error.message || error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const deleteCommentOnPost = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // find the comment first (for auth check)
    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // authorization
    if (
      comment.user.toString() !== req.user._id.toString() &&
      post.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // pull the comment
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { comments: { _id: commentId } },
      },
      { new: true },
    );
    await post.save();
    res.status(200).json({
      message: "Comment deleted successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.log("the error in deleting the comment is", error.message || error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      await Post.findByIdAndUpdate(
        req.params.id,
        { $pull: { likes: userId } },
        { new: true },
      );

      await User.findByIdAndUpdate(req.user._id, {
        $pull: { likedPosts: req.params.id },
      });

      return res.status(200).json({ message: "successfully disliked" });
    } else {
      await Post.findByIdAndUpdate(
        req.params.id,
        { $push: { likes: userId } },
        { new: true },
      );
      const newNotification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await newNotification.save();
      await User.findByIdAndUpdate(req.user._id, {
        $push: { likedPosts: req.params.id },
      });

      return res.status(200).json({ message: "successfully liked" });
    }
  } catch (error) {
    console.log("the error in liking or unliking the post is", error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error getting posts:", error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const getMyLikedPost = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    return res.status(200).json(likedPosts);
  } catch (error) {
    console.log("the error in getting my liked posts was", error);
    return res.status(500).json({ message: "internal server error" });
  }
};
export const getUserLikedPost = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const thisUser = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    if (!thisUser) {
      return res
        .status(401)
        .json({ message: "you are not authorized to see this" });
    }
    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    return res.status(200).json(likedPosts);
  } catch (error) {
    console.log("the error in getting this users liked posts was", error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const following = user.following;

    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(feedPosts);
  } catch (error) {
    console.log("Error in getFollowingPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const username = req.params.username;
    const user=await User.findOne({username})
    if(!user){
      return res.status(404).json({message:"user not found"})
    }
    const myPosts = await Post.find({ user:user._id })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    return res.status(200).json(myPosts);
  } catch (error) {
    console.log("the error in getting user posts was");
    return res.status(500).json({ message: "internal server error" });
  }
};
export const getMyPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const myPosts = await Post.find({ user: userId })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    return res.status(200).json(myPosts);
  } catch (error) {
    console.log("the error in getting my posts was");
    return res.status(500).json({ message: "internal server error" });
  }
};