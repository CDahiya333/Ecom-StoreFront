// lib/rateLimiter.js
import redis from './redis';

/**
 * Rate limiter implementation using Redis
 * @param {string} key - The unique identifier for the rate limit (e.g. IP, user ID, etc)
 * @param {number} maxAttempts - Maximum number of attempts allowed in the time window
 * @param {number} windowSecs - Time window in seconds
 * @returns {Promise<{success: boolean, remaining: number, resetTime: number}>}
 */
export const rateLimit = async (key, maxAttempts, windowSecs) => {
  const now = Date.now();
  const windowMs = windowSecs * 1000;
  
  const multi = redis.multi();
  const rateLimitKey = `ratelimit:${key}`;
  
  // Add the current timestamp to the sorted set
  multi.zadd(rateLimitKey, now, `${now}`);
  
  // Remove timestamps that are outside the current window
  multi.zremrangebyscore(rateLimitKey, 0, now - windowMs);
  multi.zcard(rateLimitKey);
  multi.expire(rateLimitKey, windowSecs);
  
  // Get the oldest timestamp in the set to calculate reset time
  multi.zrange(rateLimitKey, 0, 0);
  
  const results = await multi.exec();
  const attemptCount = results[2][1];
  const oldestTimestamp = results[4][1][0] || now;
  
  // Calculate when the rate limit will reset
  const resetTime = parseInt(oldestTimestamp) + windowMs;
  
  return {
    success: attemptCount <= maxAttempts,
    remaining: Math.max(0, maxAttempts - attemptCount),
    resetTime: resetTime,
  };
};

/**
 * Middleware for Express to apply rate limiting
 * @param {Object} options - Rate limiting options
 * @param {number} options.maxAttempts - Maximum number of attempts
 * @param {number} options.windowSecs - Time window in seconds
 * @param {Function} options.keyGenerator - Function to generate the rate limit key (defaults to IP-based)
 * @param {string} options.limitType - Type of rate limit for logging and headers
 */
export const rateLimitMiddleware = (options) => {
  const {
    maxAttempts = 5,
    windowSecs = 60,
    keyGenerator = (req) => req.ip,
    limitType = 'general'
  } = options;
  
  return async (req, res, next) => {
    try {
      const key = `${limitType}:${keyGenerator(req)}`;
      const result = await rateLimit(key, maxAttempts, windowSecs);
      
      // Set rate limit headers
      res.set('X-RateLimit-Limit', maxAttempts);
      res.set('X-RateLimit-Remaining', result.remaining);
      res.set('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000));
      
      if (!result.success) {
        return res.status(429).json({
          error: 'Too many requests',
          message: `Please try again after ${Math.ceil((result.resetTime - Date.now()) / 1000)} seconds`,
        });
      }
      
      next();
    } catch (error) {
      console.error('Rate limiting error:', error);
      // If rate limiting fails, allow the request to proceed to avoid blocking legitimate traffic
      next();
    }
  };
};

// Predefined rate limiters for common use cases
export const authRateLimiter = rateLimitMiddleware({
  maxAttempts: 5,
  windowSecs: 60 * 15, // 15 minutes
  limitType: 'auth'
});

export const otpRateLimiter = rateLimitMiddleware({
  maxAttempts: 3,
  windowSecs: 60 * 10, // 10 minutes
  limitType: 'otp'
});

export const apiRateLimiter = rateLimitMiddleware({
  maxAttempts: 100,
  windowSecs: 60 * 60, // 1 hour
  limitType: 'api'
});

export default {
  rateLimit,
  rateLimitMiddleware,
  authRateLimiter,
  otpRateLimiter,
  apiRateLimiter
};