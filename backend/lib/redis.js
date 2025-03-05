import dotenv from "dotenv";
dotenv.config();
import Redis from "ioredis";

const redis = new Redis(process.env.UPSTASH_REDIS_URI);
// console.log(process.env.UPSTASH_REDIS_URI);
export default redis;