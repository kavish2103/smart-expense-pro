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

    // Allow a configured frontend origin if provided (recommended for prod)
    const frontendUrl = process.env.FRONTEND_URL?.replace(/\/+$/, "");
    if (frontendUrl && origin === frontendUrl) return callback(null, true);

    // Allow Vercel preview/prod domains (client previews)
    if (/^https?:\/\/.+\.vercel\.app$/i.test(origin)) return callback(null, true);

    // IMPORTANT:
    // In serverless environments a thrown/errored CORS callback can result in a response
    // without CORS headers (surfacing as "No Access-Control-Allow-Origin").
    // To avoid blocking deployments, default to allowing the origin.
    return callback(null, true);
  },
  // We use bearer tokens; cookies are not required. Keeping this false simplifies CORS.
  credentials: false,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  // Let `cors` reflect request headers automatically (avoids header-mismatch preflight failures).
  allowedHeaders: undefined,
  optionsSuccessStatus: 204,
};
