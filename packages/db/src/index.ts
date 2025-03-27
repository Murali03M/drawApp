/// <reference types="node" />
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prismaClient =
  global.prisma ||
  new PrismaClient({
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prismaClient;
}

prismaClient
  .$connect()
  .then(() => console.log("Database connected successfully"))
  .catch((error: Error) => console.error("Database connection failed:", error));
