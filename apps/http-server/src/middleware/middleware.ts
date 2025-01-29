import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import  jwt  from "jsonwebtoken";

interface CustomRequest extends Request {
    userId?: string;
}

export const middleware = (req:CustomRequest, res:Response, next:NextFunction) => {

    const token = req.headers["authorization"] ?? "";
    
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;



    if (decoded) {
        req.userId = decoded.userId;
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
}