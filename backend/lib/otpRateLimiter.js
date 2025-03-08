// lib/otpRateLimiter.js
import redis from './redis';

/**
 * Rate limiter specific for OTP resend functionality
 * @param {string} userId - User ID
 * @param {string} method - Verification method ('email' or 'sms')
 * @returns {Promise<{canResend: boolean, timeRemaining: number}>}
 */
export const checkOtpResendEligibility = async (userId, method) => {
  const key = `otp:resend:${method}:${userId}`;
  const cooldownPeriod = 60; // 60 seconds cooldown between resends
  
  const lastSentTime = await redis.get(key);
  
  if (!lastSentTime) {
    return { canResend: true, timeRemaining: 0 };
  }
  
  const now = Math.floor(Date.now() / 1000);
  const timeSinceLastSend = now - parseInt(lastSentTime);
  
  if (timeSinceLastSend >= cooldownPeriod) {
    return { canResend: true, timeRemaining: 0 };
  }
  
  return {
    canResend: false,
    timeRemaining: cooldownPeriod - timeSinceLastSend
  };
};

/**
 * Record a new OTP send attempt
 * @param {string} userId - User ID
 * @param {string} method - Verification method ('email' or 'sms')
 */
export const recordOtpSendAttempt = async (userId, method) => {
  const key = `otp:resend:${method}:${userId}`;
  const now = Math.floor(Date.now() / 1000);
  
  // Store the timestamp and set expiry (2 minutes longer than cooldown to ensure proper expiry)
  await redis.set(key, now, 'EX', 60 + 120);
};

export default {
  checkOtpResendEligibility,
  recordOtpSendAttempt
};