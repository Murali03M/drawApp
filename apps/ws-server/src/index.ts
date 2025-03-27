import { WebSocketServer, WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common";
import addMessageToQueue from "./messageQueue.js";

const wss = new WebSocketServer({ port: 8081 });

interface User {
  userId: string;
  ws: WebSocket;
  rooms: string[];
}

const users: User[] = [];

const checkUser = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded.userId || !decoded) {
      return null;
    }

    return decoded.userId;
  } catch (error: any) {
    console.error("JWT Verification Failed:", error.message);
    return null;
  }
};

wss.on("connection", function connection(ws, request) {
  const url = request.url;
  console.log("New connection attempt");
  console.log("URL:", url);

  if (!url) {
    console.log("No URL provided");
    ws.send("Invalid Request");
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") ?? "";
  console.log("Token received:", token);

  const userId = checkUser(token);
  console.log("User ID from token:", userId);

  if (!userId) {
    console.log("Invalid token, closing connection");
    ws.close();
    return;
  }

  users.push({
    userId: userId,
    ws: ws,
    rooms: [],
  });

  ws.on("message", async (message) => {
    console.log("received: %s", message);
    const parsedData = JSON.parse(message as unknown as string);

    if (parsedData.type === "joinRoom") {
      const user = users.find((x) => x.ws == ws);
      if (user) {
        user.rooms.push(parsedData.roomId);
      }
    }

    if (parsedData.type === "leaveRoom") {
      const user = users.find((x) => x.ws == ws);
      if (user) {
        user.rooms = user.rooms.filter((x) => x !== parsedData.roomId);
      }
    }

    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      console.log("chat message received");

      //adding message to queue using redis bullmq
      await addMessageToQueue(userId, roomId, message);

      users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(
            JSON.stringify({
              type: "chat",
              message: message,
              roomId:roomId,
            })
          );
        }
      });
    }
  });

  ws.send("conncted to the websocket");
});

console.log("WebSocket server is running at ws://localhost:8081/");
