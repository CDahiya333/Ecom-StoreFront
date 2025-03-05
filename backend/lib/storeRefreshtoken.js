import redis from "./redis.js";
const storeRefreshToken = async (userId, refreshToken) => {
  try {
    await redis.set(
      `refresh_token:${userId}`,
      refreshToken,
      "EX",
      7 * 24 * 60 * 60
    );
  } catch (error) {
    console.log("Error in storeRefreshToken");
    throw error;
  }
};
export default storeRefreshToken;