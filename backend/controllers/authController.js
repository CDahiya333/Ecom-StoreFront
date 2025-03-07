import User from "../models/userModel.js";
import setCookies from "../lib/setCookies.js";
import generateTokens from "../lib/generateTokens.js";
import redis from "../lib/redis.js";
import jwt from "jsonwebtoken";
import resetAccessToken from "../lib/resetAccessToken.js";
import sendSms from "../lib/sendSms.js";

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

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "User Created Successfully",
    });
  } catch (error) {
    console.error("Error in SignUp Controller:", error);

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
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateTokens(user._id);
      setCookies(res, accessToken, refreshToken);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(401).json({ message: "Invalid Email or Password" });
    }
  } catch (error) {
    console.log("Error in login", error.message);
    res.status(500).json({ message: error.message });
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
    return res
      .status(500)
      .json({ message: "Server Error During Logout", error: error.message });
  }
};

export const tokenRefresher = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);
    if (storedToken !== refreshToken) {
      res.status(400).json({ message: "Invalid Refresh Token" });
    }
    // Providing a new Access Token
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_SECRET,
      {
        expiresIn: "15m",
      }
    );
    resetAccessToken(res, accessToken);
    res.status(200).json({ message: "Token Refreshed Successfully" });
  } catch (error) {
    console.log("Error in tokenRefresher", error.message);
    res.status(500).json({ message: error.message });
  }
};

// export const getProfile = async (req, res) => {
//   try {

//   } catch (error) {
//     console.log("Error in getProfile", error.message);
//     res.status(500).json({ message: error.message });
//   }
// }

export const sendOtp = async (req, res) => {
  try {
    // console.log("Trying to Send OTP");
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = Date.now() + 5 * 60 * 1000;
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }

    // Updating otp fields
    user.otp = otp;
    user.otp_expiry= otpExpiry;
    await user.save({validateBeforeSave: false});
    const result = await sendSms(phone, otp);
    if (result.success) {
      return res
        .status(200)
        .json({ success: true, message: "OTP Sent Successfully" });
    } else {
      return res.status(500).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.log("Error in sendOtp", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (user.otp_expiry < Date.now()) {
      return res.status(400).json({ message: "OTP Expired" });
    }
    user.otp = null;
    user.otp_expiry = null;
    // update verification
    user.isVerified = true;
    await user.save({validateBeforeSave: false});
    res.status(200).json({ message: "OTP Verified Successfully" });
  } catch (error) {
    console.log("Error in verifyOtp", error.message);
    res.status(500).json({ message: error.message });
  }
};
