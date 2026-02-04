import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  // Don't rate-limit CORS preflight
  skip: (req) => req.method === "OPTIONS",
  message: {
    message: "Too many requests, please try again later",
  },
});
