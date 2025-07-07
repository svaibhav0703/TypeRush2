import Users from "../model/users.js";
import bcrypt from "bcryptjs";
import createToken from "../jwt/createToken.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const registerUser = async (req, res) => {
  try {
    // getting userName,password and email from the frontend
    const { userName, password, email } = req.body;

    // if any of the field is empty return with a message
    if (!userName || !password || !email)
      return res.status(400).json({ message: "fill all fields" });

    // if user exists already return a message
    const userExists = await Users.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "user already exists" });

    // create the new user
    const hashedPassword = await bcrypt.hash(password, 8);
    const User = new Users({ userName, password: hashedPassword, email });
    await User.save();
    const Token = createToken(User._id);

    // send the https only cookie
    res.cookie("token", Token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    // send the response from the back-end to front-end
    res.status(201).json({
      _id: User._id,
      userName: User.userName,
      email: User.email,
      isAdmin: User.isAdmin,
    });
  } catch (error) {
    // if an error occurs inside the try block it is returned to the frontend
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    // getting userName and password from the frontend
    const { userName, password } = req.body;

    const userFound = await Users.findOne({ userName });
    // if userName is not found the we return a message
    if (!userFound) return res.status(500).json({ message: "wrong username" });

    if (userFound.password == process.env.GOOGLE_PASS)
      return res.status(500).json({ message: "login with google" });

    const passwordMatch = await bcrypt.compare(password, userFound.password);
    // if password does not match return
    if (!passwordMatch)
      return res.status(500).json({ message: "wrong password" });

    // create a new token
    const Token = createToken(userFound._id);

    // send the https only cookie
    res.cookie("token", Token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // send the response from back-end to frontend
    res.status(201).json({
      _id: userFound._id,
      userName: userFound.userName,
      email: userFound.email,
      isAdmin: userFound.isAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: "login failed" });
  }
};

const updateUser = async (req, res) => {
  try {
    console.log("== Update route hit ==");

    // Log the incoming body and user
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const {
      userName,
      password,
      email,
      score15,
      score30,
      score60,
      tests,
      wins,
      losses,
    } = req.body;
    const userId = req.user.userId;

    const User = await Users.findById(userId);
    if (!User) {
      return res.status(404).json({ message: "User not found" });
    }

    if (User.password === process.env.GOOGLE_PASS && (email || password)) {
      return res
        .status(400)
        .json({ message: "Google account - cannot change Email and password" });
    }

    const newUserName = userName || User.userName;
    const newscore15 = score15 || User.score15;
    const newscore30 = score30 || User.score30;
    const newscore60 = score60 || User.score60;
    const newwins = wins || User.wins;
    const newlosses = losses || User.losses;
    const newtests = tests || User.tests;

    let newPassword = User.password;
    if (password) {
      newPassword = await bcrypt.hash(password, 8);
    }

    const newEmail = email || User.email;

    const newUser = await Users.findByIdAndUpdate(
      userId,
      {
        userName: newUserName,
        password: newPassword,
        email: newEmail,
        score15: newscore15,
        score30: newscore30,
        score60: newscore60,
        losses: newlosses,
        tests: newtests,
        wins: newwins,
      },
      { new: true }
    );

    const Token = createToken(newUser._id);
    res.cookie("token", Token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      _id: newUser._id,
      userName: newUser.userName,
      email: newUser.email,
      score15: newUser.score15,
      score30: newUser.score30,
      score60: newUser.score60,
      wins: newUser.wins,
      tests: newUser.tests,
      losses: newlosses.losses,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "User details update failed" });
  }
};

const getFastestUsers = async (req, res) => {
  try {
    const { duration } = req.body;
    const { userId } = req.user;

    console.log("user", userId, "duration", duration);
    const sortKey =
      duration == 15 ? "score15" : duration == 30 ? "score30" : "score60";

    const SortedUsers = await Users.aggregate([
      { $sort: { [sortKey]: -1, tests: -1 } },
      { $limit: 25 }, // get top 25 users from the world
    ]);
    console.log("all users", SortedUsers);

    return res.status(200).json(SortedUsers);
  } catch (error) {
    res.status(500).json({ message: "cannot get the fastest tests" });
  }
};
const getMySpeedRank = async (req, res) => {
  try {
    const { duration } = req.body;
    const { userId } = req.user;

    console.log("user", userId, "duration", duration);
    const sortKey =
      duration == 15 ? "score15" : duration == 30 ? "score30" : "score60";

    const SortedUsers = await Users.aggregate([
      { $sort: { [sortKey]: -1, tests: -1 } },
    ]);
    console.log("all users", SortedUsers);
    const Rank = SortedUsers.findIndex((x) => String(x._id) === userId) + 1;

    return res.status(200).json({ Rank });
  } catch (error) {
    res.status(500).json({ message: "cannot get your rank" });
  }
};

const getTopUsers = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "cannot get the fastest tests" });
  }
};
const getMyWinRank = async (req, res) => {};

const getUser = async (req, res) => {
  try {
    // we will have req.user here in which userIf will be stored ;
    const User = await Users.findById(req.user.userId).select("-password");
    if (!User) return res.status(400).json({ messgae: "user not found" });
    res.status(200).json(User);
  } catch (error) {
    res.status(400).json({ message: "cannot get the user" });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "strict",
      path: "/",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "logout failed" });
  }
};

export {
  registerUser,
  loginUser,
  updateUser,
  getUser,
  logoutUser,
  getFastestUsers,
  getMySpeedRank,
  getTopUsers,
  getMyWinRank,
};
