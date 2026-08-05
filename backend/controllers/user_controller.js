import User from "../models/user_model.js";
import Notification from "../models/notification_model.js";
import bcrypt from "bcryptjs";

import { v2 as cloudinary } from "cloudinary";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    console.log(`the error in getting user data is ${error}`);
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You can't follow/unfollow yourself" });
    }

    if (!userToModify || !currentUser)
      return res.status(400).json({ error: "User not found" });

    const isFollowing = currentUser.following.includes(userToModify._id);

    if (isFollowing) {
      // Unfollow the user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // Follow the user
      await User.findByIdAndUpdate(id, {
        $addToSet: { followers: req.user._id },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { following: id },
      });
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: id,
      });
      await newNotification.save();
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.log("Error in followUnfollowUser: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getSuggestedUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const usersFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);
    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(req.user._id),
    );
    const suggestedUsers = filteredUsers.slice(0, 5);
    suggestedUsers.forEach((user) => (user.password = null));
    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log(`the error in getting use suggestion is ${error}`);
    res.status(500).json({ message: "internal server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      username,
      currentPassword,
      newPassword,
      bio,
      link,
    } = req.body;
    let { profileImg, coverImg } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    if (currentPassword || newPassword) {
      if (currentPassword === "" || newPassword === "") {
        return res
          .status(400)
          .json({ message: "provide both current and new password" });
      }

      const isMatch = await bcrypt.compare(
        currentPassword,
        user.password || "",
      );
      if (!isMatch) {
        return res.status(400).json({ message: "incorrect current password" });
      }
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ message: "new password must be at least 6 characters" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (profileImg) {
      if (user.profileImg?.publicId) {
        await cloudinary.uploader.destroy(user.profileImg.publicId);
      }

      const uploadedResponse = await cloudinary.uploader.upload(profileImg);

      user.profileImg = {
        url: uploadedResponse.secure_url,
        publicId: uploadedResponse.public_id,
      };
    }

    if (coverImg) {
      if (user.coverImg?.publicId) {
        await cloudinary.uploader.destroy(user.coverImg.publicId);
      }

      const uploadedResponse = await cloudinary.uploader.upload(coverImg);

      user.coverImg = {
        url: uploadedResponse.secure_url,
        publicId: uploadedResponse.public_id,
      };
    }

    if (fullName !== undefined && fullName.trim() !== "")
      user.fullName = fullName;
    if (email !== undefined && email.trim() !== "") user.email = email;
    if (username !== undefined && username.trim() !== "")
      user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (link !== undefined) user.link = link;


    await user.save();

    user.password = null;

    return res.status(200).json({ message: "user updated successfully", user });
  } catch (error) {
    console.log(`the error in updating user was ${error}`);
    res.status(500).json({ error: "internal server error" });
  }
};
