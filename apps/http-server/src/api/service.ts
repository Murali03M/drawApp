import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { prismaClient } from "@repo/db/prisma";



export const LoginService = async (event:any) => {
    try {
        if (!event.username) {
            return {
                success: false,
                message: "Username is required"
            };
        }

        // Find user in database
        const data = await prismaClient.user.findUnique({
            where: {
                username: event.username
            }
        });

        if (!data) {
            return {
                success: false,
                message: "User not found"
            };
        }

        // Check password
        if (data.password !== event.password) {
            return {
                success: false,
                message: "Invalid password"
            };
        }



        // Generate JWT token
        const token = jwt.sign({ userId: data.username}, JWT_SECRET);

        return {
            success: true,
            message: "Login Successful",
            data: {
                userId: data.username,
                token: token
            }
        };

    } catch (error) {
        console.error("LoginService Error:", error);
        return {
            success: false,
            message: "Internal Server Error"
        };
    }
};


export const RegisterService = async (event: any) => {
     
    const data = await prismaClient.user.create({
        data: {
            name: event.name,
            password: event.password,
            email: event.email,
            photo: event.photo,

        },

    });

    if(!data){
        return {
            success: false,
            message: "Internal Server Error"
        }
    }

    const token = jwt.sign({ userId: data.username}, JWT_SECRET);


     
    return {
        success: true,
        message: "Register Successful",
        data: {
            userId: data.username,
            token: token
        }
    }
}


export const crateRoomService = () => {

    const roomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    return {
        success: true,
        roomId
    }



}
