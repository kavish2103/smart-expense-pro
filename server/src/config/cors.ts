import cors, { CorsOptions } from "cors";

const allowedOrigins = [
  "http://localhost:3000", // frontend (dev)
  "http://localhost:5173", // vite (optional)
];

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    // Allow Postman, server-to-server, curl
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};
