"use client";

import { useEffect, useState } from "react";
import useSocket from "../hooks/useScoket";

interface ChatMessage {
  id: string;
  message: string;
  userId: string;
  roomId: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatResponse {
  success: boolean;
  data: ChatMessage[];
}

export default function ChatRoomClient({
  messages,
  id,
}: {
  messages: ChatResponse;
  id: string;
}) {
  const { loading, socket } = useSocket();
  const [chats, setChats] = useState<ChatMessage[]>(messages.data);
  const [currentMessage, setCurrentmessage] = useState("");

  useEffect(() => {
    if (socket && !loading) {
      socket.send(
        JSON.stringify({
          type: "joinRoom",
          roomId: id,
        })
      );

      const handleMessage = (event: MessageEvent) => {
        const parsedData = JSON.parse(event.data);
        if (parsedData.type === "chat") {
          const newMessage: ChatMessage = {
            id: crypto.randomUUID(),
            message: parsedData.message,
            userId: "",
            roomId: id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setChats((prevChats) => [newMessage,...prevChats]);
        }
      };

      socket.addEventListener("message", handleMessage);

      return () => {
        socket.removeEventListener("message", handleMessage);
        socket.close();
      };
    }
  }, [socket, loading, id]);

  return (
    <div>
      {chats.map((chat) => (
        <div key={chat.id}>{chat.message}</div>
      ))}
      <input
        type="text"
        value={currentMessage}
        onChange={(e) => setCurrentmessage(e.target.value)}
      />
      <button
        onClick={() => {
          socket?.send(
            JSON.stringify({
              type: "chat",
              roomId: id,
              message: currentMessage,
            })
          );
          setCurrentmessage("");
        }}
      >
        Click
      </button>
    </div>
  );
}
