'use client'

import { useRouter } from "next/navigation";
import {  useState } from "react";

export default function Home() {
  const [data, setData] = useState("");

  const route = useRouter();

 


  return (
    <div>
      <input
        value={data}
        onChange={(e) => setData((e.target as HTMLInputElement).value)}
      />
      <button onClick={()=>route.push(`/room/${data}`)}>Send</button>
    </div>
  );
}
