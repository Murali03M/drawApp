import axios from "axios";
import { BACKEND_URL } from "../config";
import ChatRoomClient from "./chatRoomClient";

interface ChatRoomProps {
  roomId: string;
}

async function getChats({ roomId }: ChatRoomProps) {
  const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
  console.log("responsemessage from rroom",response);
  
  return response.data;

}

export default async function ChatRoom({ roomId }: ChatRoomProps) {
  const messages = await getChats({ roomId });

  console.log(messages);
  

  return (
    <div>
      <ChatRoomClient messages={messages} id={roomId} />
    </div>
  );
}
