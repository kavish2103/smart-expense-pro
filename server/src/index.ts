import dotenv from "dotenv";
dotenv.config(); // ✅ FIRST

import app from "./app";
import { env } from "./config/env";

if (!env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

if (!env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

app.listen(Number(env.PORT), () => {
  console.log(`Server running on port ${env.PORT}`);
});
