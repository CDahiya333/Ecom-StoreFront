import jwt from "jsonwebtoken";
import storeRefreshToken from "./storeRefreshtoken.js";

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });
  storeRefreshToken(userId, refreshToken);
  return { accessToken, refreshToken };
};
export default generateTokens;
