import mongoose from "mongoose";
const testInfoSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // the text inside the mongoose.model should come here
      required: true,
    },
    difficulty: { type: String, required: true },
    duration: { type: Number, required: true },
    speed: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    fastest: { type: Boolean, default: false },
    secondData: { type: [Number], default: [] },
    mistakes: { type: [Number], default: [] },
  },
  { timestamps: true }
);

const testInfo = mongoose.model("testInfo", testInfoSchema);
export default testInfo;
