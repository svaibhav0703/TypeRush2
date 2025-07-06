import mongoose from "mongoose";

const DBconnect = async (DATABASE_URL) => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log("database connected");
  } catch (error) {
    console.log(error);
  }
};

export default DBconnect;
