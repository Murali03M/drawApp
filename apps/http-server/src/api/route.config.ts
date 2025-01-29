import { Router, Router as ExpressRouter, Request, Response } from "express";
import { crateRoomController, LoginController, RegisterController } from "./controller";
import { middleware } from "../middleware/middleware";
import { createRoomSchema, createUserSchema, SiginSchema } from "@repo/common/types";

export const route: ExpressRouter = Router();


route.post("/login", async (req: Request, res: Response) => {  

    const parasedData = SiginSchema.safeParse(req.body);

    if(!parasedData.success){
        res.status(400).json({ message:"incorect inputs"})
        return;
    }

    const result = await LoginController(parasedData.data);
    
     res.send(result);
   
});
    

route.post("/register", async (req: Request, res: Response) => {

    const parasedData = SiginSchema.safeParse(req.body);

    if(!parasedData.success){
        res.status(400).json({ message:"incorect inputs"})
        return;
    }

    const result = await RegisterController(parasedData.data);
    return result;
 
});


route.get("/createRoom", middleware, async (req: Request, res: Response) => {

    const data = createRoomSchema.safeParse(req.body);

    if(!data.success){
        res.status(400).send(data.error);
        return;
    }
    
    const result = await crateRoomController();


    res.send(result);
}); 
