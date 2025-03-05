import User from "../models/userModel.js";
import setCookies from "../lib/setCookies.js";
import generateTokens from "../lib/generateTokens.js";
import redis from "../lib/redis.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const ExistingUser = await User.findOne({ email });

    if (ExistingUser) {
      return res.status(400).json("User Already Exists");
    }
    const user = await User.create({ name, email, password });

    // authenticate
    const { accessToken, refreshToken } = generateTokens(user._id);
    // console.log("Generated tokens:", { accessToken, refreshToken });
    setCookies(res, accessToken, refreshToken);

    res.status(201).json({ user:{
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }, message: "User Created Successfully" });
  } catch (error) {
    console.error("Signup Error:", error);

    // 1) Bad Request
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    // 3) Otherwise, fallback to 500
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    res.send("Login Route Called");
  } catch (error) {
    console.log("Error in Login Route");
    res.status(500).send(`Error in Login`);
  }
};

export const logout = async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      
      // Check if the token exists and is not empty
      if (!refreshToken || refreshToken.trim() === "") {
        return res.status(400).json({ message: "No refresh token provided" });
      }
      
      // Verify the refresh token
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
      const userId = decoded.userId;
      
      // Delete the token from Redis
      await redis.del(`refresh_token:${userId}`);
      
      // Clear cookies and send response once
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      return res.status(200).json({ message: "Logout Success" });
      
    } catch (error) {
      // Optionally clear cookies even if there's an error
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      return res.status(500).json({ message: "Server Error During Logout", error: error.message });
    }
  };
  