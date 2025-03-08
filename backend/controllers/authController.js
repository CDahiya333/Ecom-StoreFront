import User from "../models/userModel.js";
import setCookies from "../lib/setCookies.js";
import generateTokens from "../lib/generateTokens.js";
import redis from "../lib/redis.js";
import jwt from "jsonwebtoken";
import resetAccessToken from "../lib/resetAccessToken.js";
import sendSms from "../lib/sendSms.js";
import sendEmail from "../lib/sendEmail.js";

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
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    } catch (err) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }

    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);
    if (storedToken !== refreshToken) {
      return res.status(400).json({ message: "Invalid Refresh Token" });
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
    const { phone, email } = req.body;

    if (!phone || !email) {
      return res.status(400).json({
        success: false,
        message: "Both phone and email are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate OTPs
    const otpPhone = Math.floor(100000 + Math.random() * 900000).toString();
    const otpEmail = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiryPhone = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
    const otpExpiryEmail = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    // Update user with new OTPs
    user.otpPhone = otpPhone;
    user.otpEmail = otpEmail;
    user.otp_expiry_Phone = otpExpiryPhone;
    user.otp_expiry_Email = otpExpiryEmail;

    await user.save({ validateBeforeSave: false });

    // Send Email OTP
    const emailResult = await sendEmail(email, otpEmail);

    // Send SMS OTP
    const smsResult = await sendSms(phone, otpPhone);

    if (smsResult.success && emailResult.success) {
      return res.status(200).json({
        success: true,
        message: "Verification codes sent to your phone and email",
      });
    } else {
      let errorMessage = "Failed to send verification codes";
      if (!smsResult.success) errorMessage += ": SMS error";
      if (!emailResult.success) errorMessage += ": Email error";

      return res.status(500).json({
        success: false,
        message: errorMessage,
      });
    }
  } catch (error) {
    console.log("Error in sendOtp:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, phoneOtp, emailOtp } = req.body;

    if (!email || !phoneOtp || !emailOtp) {
      return res.status(400).json({
        success: false,
        message: "Email and both verification codes are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if OTPs match
    const isPhoneOtpValid = user.otpPhone === phoneOtp;
    const isEmailOtpValid = user.otpEmail === emailOtp;

    // Check if OTPs are expired
    const isPhoneOtpExpired =
      user.otp_expiry_Phone && user.otp_expiry_Phone < new Date();
    const isEmailOtpExpired =
      user.otp_expiry_Email && user.otp_expiry_Email < new Date();

    if (isPhoneOtpExpired || isEmailOtpExpired) {
      return res.status(400).json({
        success: false,
        message: "Verification Code has expired",
      });
    }

    if (!isPhoneOtpValid || !isEmailOtpValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code(s)",
      });
    }

    // Reset OTP fields
    user.otpPhone = null;
    user.otpEmail = null;
    user.otp_expiry_Phone = null;
    user.otp_expiry_Email = null;

    // Update verification status
    user.isVerified = true;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Verification successful",
    });
  } catch (error) {
    console.log("Error in verifyOtp:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
