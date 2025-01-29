import { z } from "zod";

export const createUserSchema = z.object({
    password: z.string(),
    name: z.string(),
    email: z.string().email(),
    photo: z.string().optional(),
    


})

export const SiginSchema = z.object({
    username: z.string().min(3).max(255),
    password: z.string()
})

export const createRoomSchema = z.object({

    name: z.string().min(3).max(255),
    slug: z.string().min(3).max(255),
    adminId: z.string()


})
