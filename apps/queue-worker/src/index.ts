import { Worker } from "bullmq";
import Redis from "ioredis";
import saveMessagesToDb from "./saveMessagetoDb.js";

interface Result {
  userId: string;
  roomId: string;
  message: string;
}

const connection = new Redis.default({ maxRetriesPerRequest: null });
const redisClient = new Redis.default({ maxRetriesPerRequest: null });

// Worker: Add messages to Redis
const worker = new Worker(
  "chatMessages",
  async (job) => {
    const { message, roomId, userId } = job.data;

    console.log("Received job data:", job.data);

    const key = `message:${job.id}`; // Use job ID to store each message uniquely
    await redisClient.hmset(key, {
      userId,
      roomId,
      message,
    });

    console.log("Stored message in Redis:", key);
  },
  { connection }
);

// Process Batch Messages from Redis
const processBatch = async () => {
  console.log("Fetching batch messages from Redis...");

  const keys = await redisClient.keys("message:*");

  if (keys.length === 0) {
    console.log("No messages to process.");
    return;
  }

  const pipeline = redisClient.pipeline();
  keys.forEach((key) => pipeline.hgetall(key));

  const results = await pipeline.exec();

  if (results) {
    const messages: Result[] = results
      .filter(([error, _]) => !error)
      .map(([_, result]) => {
        const data = result as Record<string, string>;
        return {
          userId: data["userId"],
          roomId: data["roomId"],
          message: data["message"],
        };
      });

    if (messages.length > 0) {
      console.log("Processing messages:", messages);

      // Save messages to DB
      await saveMessagesToDb(messages);

      // Delete processed messages
      const deletePipeline = redisClient.pipeline();
      keys.forEach((key) => deletePipeline.del(key));
      await deletePipeline.exec();

      console.log("Deleted processed messages from Redis.");
    }
  }
};

// Run batch processing every 10 seconds
setInterval(processBatch, 10000);

// Worker Event Listeners
worker.on("completed", (job) => {
  console.log(`Job ${job.id} has completed.`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed with error: ${err.message}`);
});

console.log("Worker is running...");
