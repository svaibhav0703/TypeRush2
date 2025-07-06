import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import Users from "../model/users.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new Strategy( // the client id and callback URL sent to google for authentication purposes and then google
    {
      // responds by sending the accessToken refreshToken and profile of the user
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      // this callback function runs after the google authentication
      try {
        const existingUser = await Users.findOne({
          email: profile.emails[0].value,
        });
        let user;
        // if user is not existing then create new user
        if (!existingUser) {
          const randomNum = Math.floor(1000 * Math.random()).toString();
          const userName =
            profile.name.givenName + randomNum + profile.name.givenName;
          const email = profile.emails[0].value;
          const password = "GOOGLE_AUTH";

          const newUser = new Users({ userName, email, password });
          user = await newUser.save();
        } else {
          user = existingUser;
        }

        return done(null, {
          // this is saved in req.user after the authentication is complete
          // error, user details
          _id: user._id,
          userName: user.userName,
          email: user.email,
        });
      } catch (error) {
        done(error, null);
      }
    }
  )
);

export default passport;
