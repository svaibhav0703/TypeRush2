import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  isAdmin: { type: Boolean, default: false },
  score15: { type: Number, default: 0 },
  score30: { type: Number, default: 0 },
  score60: { type: Number, default: 0 },
  tests: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
});

const Users = mongoose.model("users", userSchema);
export default Users;
