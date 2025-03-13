import { z } from "zod";

export const createUserSchema = z.object({
    password: z.string(),
    name: z.string(),
    email: z.string().email(),
    photo: z.string().optional(),
    


})

export const SiginSchema = z.object({
    email: z.string().email(),
    password: z.string()
})

export const createRoomSchema = z.object({

    slug: z.string().min(3).max(255)


})
