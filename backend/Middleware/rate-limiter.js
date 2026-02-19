const rateLimit = require("express-rate-limit");

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many login attempts from this IP, please try again after 15 minutes",
  },
  skipSuccessfulRequests: true,
});

module.exports = { loginRateLimiter };