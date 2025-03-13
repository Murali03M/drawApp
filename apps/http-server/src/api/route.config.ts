import express from "express";
import { Router, Router as ExpressRouter, Request, Response } from "express";
import {
  crateRoomController,
  LoginController,
  RegisterController,
} from "./controller.js";
import { middleware } from "../middleware/middleware.js";
import {
  createRoomSchema,
  createUserSchema,
  SiginSchema,
} from "@repo/common/types";


interface CustomRequest extends Request {
    userId?: string;
}


export const route: ExpressRouter = Router();

route.post("/login", async (req: Request, res: Response) => {
  const parasedData = SiginSchema.safeParse(req.body);

  if (!parasedData.success) {
    res.status(400).json({ message: "incorect inputs" });
    return;
  }

  const result = await LoginController(parasedData.data);

  res.json(result);
});

route.post("/register", async (req: Request, res: Response) => {
  const parasedData = createUserSchema.safeParse(req.body);

  if (!parasedData.success) {
    res.status(400).json({ message: "incorect inputs" });
    return;
  }

  const result = await RegisterController(parasedData.data);
  res.json(result);
});

route.get("/createRoom", middleware, async (req: CustomRequest, res: Response) => {
    const parsedDatadata = createRoomSchema.safeParse(req.body);

    const userId: string = req.userId as string; 


    console.log(parsedDatadata);
    
    


  if (!parsedDatadata.success) {
    res.status(400).send(parsedDatadata.error);
    return;
  }

  const result = await crateRoomController(parsedDatadata.data, userId);

  res.send(result);
});
