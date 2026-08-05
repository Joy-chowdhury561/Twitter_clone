import User from "../models/user_model.js";
import { generateTokenAndSetCookie } from "../lib/utils/generate_token.js";
import bcrypt from "bcryptjs";
const signUp = async (req, res) => {
  try {
    const { username, email, fullName, password } = req.body;
    const trimmedUserName = username.trim();
    const trimmedPassword=password.trim();
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "invalid email input" });
    }
    if (trimmedUserName.includes(" ")) {
      return res
        .status(400)
        .json({
          success: false,
          message: "username cannot have spaces in between",
        });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res
        .status(400)
        .json({ success: false, message: " this  username is already taken" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({
          success: false,
          message: "this Email is already used for sign up",
        });
    }

    if (trimmedPassword.length < 5 || trimmedPassword.length > 25) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "the password should be at least 6 characters long or under 25 characters",
        });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(trimmedPassword, salt);
    const newUser = new User({
      fullName,
      email,
      username,
      password:hashedPassword,
    });
    if (newUser) {
      await newUser.save();
      generateTokenAndSetCookie(newUser._id, res);

      res.status(201).json({
        success: true,
        message: "user was created successfully",

        _id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        username: newUser.username,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
    } else {
      res.status(400).json({});
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
    console.log(error);
  }
};
const logIn = async (req, res) => {
  try {
    const { username, password } = req.body;
    const trimmedUserName=username.trim();
    const trimmedPassword=password.trim();
    const user = await User.findOne({
      $or: [{ username: trimmedUserName }, { email: trimmedUserName }],
    });

    if (!user) {
      return res.status(404).json({ message: "Invalid credentials!" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      trimmedPassword,
      user.password || "",
    );
    if (!isPasswordCorrect) {
      return res
        .status(404)
        .json({ message: "invalid credentials!" });
    }

    generateTokenAndSetCookie(user._id, res);

    res
      .status(200)
      .json({
        success: true,
        message: "logged in",
        _id: user._id,
        username: user.username,
        email: user.email,
        followers: user.followers,
        following: user.following,
        coverImg: user.coverImg,
        profileImg: user.profileImg,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
    console.log(error);
  }
};
const logOut = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    });
    res.status(200).json({ message: "logged out" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    console.log(`the error in logout is ${error}`);
  }
};

const getMe = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({ message: "success in getting the user", user });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    console.log(`the error in getting the user data is ${error}`);
  }
};

export { signUp, logIn, logOut, getMe };
