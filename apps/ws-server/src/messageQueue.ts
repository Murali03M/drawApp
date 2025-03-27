import { Queue } from "bullmq";
import Redis from "ioredis";

const redisConnection = new Redis.default();
const messageQueue = new Queue("chatMessages", { connection: redisConnection });

const addMessageToQueue = async (
  userId: string,
  roomId: string,
  message: string
) => {
  await messageQueue.add("chatMessage", { userId, roomId, message });
};

export default addMessageToQueue;
