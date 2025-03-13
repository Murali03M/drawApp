import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common";

const wss = new WebSocketServer({ port: 8080 });


const checkUser = (token: string): string | null => {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    
    if (typeof decoded == "string")
    {
        return null;
    }

    if (!decoded.userId || !decoded) {
    return null;
    }

    return decoded.userId;
    
    
};  

wss.on("connection", function connection(ws, request) {
  const url = request.url;

  if (!url) {
    ws.send("Invalid Request");
    return;
  }

  const queryPaarams = new URLSearchParams(url.split("?")[1]);
  const token = queryPaarams.get("token") ?? "";

  const userId = checkUser(token);

    if (!userId)
    {
        ws.close();
        return;
    }

      
 

  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
  });

  ws.send("something");
});

console.log("WebSocket server is running at ws://localhost:8080/");
