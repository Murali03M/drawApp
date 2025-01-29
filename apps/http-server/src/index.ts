import express from "express";
import cors from "cors";
import { route } from "./api/route.config";
const app = express();

app.use(cors());
app.use(express.json());



app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1", route);



app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

