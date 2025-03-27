import axios from "axios";
import { BACKEND_URL } from "../../config";
import ChatRoom from "../../components/chatRoom";

async function getRoomId(slug: string) {
    const response = await axios.get(`${BACKEND_URL}/room/${slug}`);
    console.log("response from the skluig", response);
    
  return response.data.data.id;
}

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function RoomPage({ params }: PageProps) {
    const { slug } = await params;

    console.log("slug",slug);
    
    
  const roomId = await getRoomId(slug);

  return (
    <div>
      <ChatRoom roomId={roomId} />
    </div>
  );
}
