import jwt from "jsonwebtoken";
const createToken = (userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    return token;
  } catch (error) {
    throw new Error("token creation failed");
  }
};

export default createToken;
