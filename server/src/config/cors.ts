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

    // Allow explicit dev origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow Vercel preview/prod domains (client + server previews)
    // Example: https://smart-expense-pro-client-xyz.vercel.app
    // Example: https://smart-expense-pro-client.vercel.app
    if (/^https?:\/\/.+\.vercel\.app$/i.test(origin)) {
      return callback(null, true);
    }

    // Allow a configured frontend origin if provided
    const frontendUrl = process.env.FRONTEND_URL?.replace(/\/+$/, "");
    if (frontendUrl && origin === frontendUrl) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
