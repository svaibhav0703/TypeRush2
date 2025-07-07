import express from "express";
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from "../controllers/userController.js";
import {
  getFastestUsers,
  getMySpeedRank,
  getMyWinRank,
  getTopUsers,
} from "../controllers/userController.js";
import auth from "../middleware/auth.js";
import passport from "../googleAuth/googleStrategy.js";
import Users from "../model/users.js";
import createToken from "../jwt/createToken.js";
const router = express.Router();

router.post("/register", registerUser); // path, middleware , controller function
router.post("/login", loginUser);
router.put("/update-profile", auth, updateUser);
router.post("/logout", logoutUser);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
); // here the login is inititated when the user clicks on login with google

router.get(
  "/auth/google/callback", // this is the url where googleOauth redirects after generating token
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res) => {
    const loggedUser = await Users.findById(req.user._id);
    const Token = createToken(loggedUser._id);
    // http cookei si sent
    res.cookie("token", Token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.redirect("https://type-rush2-yays.vercel.app/user-page");
  }
);

router.get("/auth/google/getUser", auth, getUser); // first we get authorized and req.user is assigned the
// userId then we get the user and return it to the frontend

router.post("/getFastestUsers", auth, getFastestUsers),
  router.post("/getMySpeedRank", auth, getMySpeedRank),
  router.get("/getTopUsers", auth, getTopUsers),
  router.get("/getMyWinRank", auth, getMyWinRank);
export default router;
