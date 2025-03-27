import { Result } from "./types.js";
import { prismaClient } from "@repo/db/prisma";

const saveMessagesToDb = async (results: Result[]) => {
  try {
    await prismaClient.chat.createMany({
      data: results.map((result) => ({
        message: result.message,
        userId: result.userId,
        roomId: result.roomId,
      })),
    });
    console.log("Messages saved to database successfully");
  } catch (error) {
    console.error("Error saving messages to database:", error);
    throw error;
  }
};

export default saveMessagesToDb;
