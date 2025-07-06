import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Users from "../model/users.js";
dotenv.config();

const authAdmin = async (req, res, next) => {
  try {
    console.log(req.user);
    const User = await Users.findById(req.user.userId);
    console.log(User);
    if (!User.isAdmin)
      return res.status(500).json({ message: "the user is not an admin" });
    next();
  } catch (error) {
    res.status(500).json({ message: "authorization failed" });
  }
};

export default authAdmin;
