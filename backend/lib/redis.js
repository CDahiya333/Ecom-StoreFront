import dotenv from "dotenv";
import Redis from "ioredis";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Loading Enivronment Variables
dotenv.config({ path: path.join(__dirname, "../../.env") });

const redisUrl = process.env.UPSTASH_REDIS_URI;
console.log("Redis URL being used:", redisUrl);

if (!redisUrl) {
  throw new Error("UPSTASH_REDIS_URI is not defined in environment variables");
}

const redis = new Redis(redisUrl);

// Add error handler
redis.on("error", (err) => {
  console.error("Redis connection error:", err.message);
});

redis.on("connect", () => {
  console.log("Successfully connected to Redis");
});

export default redis;
