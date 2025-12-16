import dotenv from "dotenv";
import app from "./app";
import { env } from "./config/env";

dotenv.config();

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});
