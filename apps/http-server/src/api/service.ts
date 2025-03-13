import jwt from "jsonwebtoken";
import { prismaClient } from "@repo/db/prisma";
import { JWT_SECRET } from "@repo/backend-common";

export const LoginService = async (event: any) => {
  try {
    if (!event.email) {
      return {
        success: false,
        message: "email is required",
      };
    }

    // Find user in database
    const data = await prismaClient.user.findUnique({
      where: {
        email: event.email,
      },
    });

    if (!data) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Check password
    if (data.password !== event.password) {
      return {
        success: false,
        message: "Invalid password",
      };
    }

    // Generate JWT token
    const token = jwt.sign({ userId: data.email }, JWT_SECRET);

    return {
      success: true,
      message: "Login Successful",
      data: {
        userId: data.email,
        token: token,
      },
    };
  } catch (error) {
    console.error("LoginService Error:", error);
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};

export const RegisterService = async (event: any) => {
  try {
    const data = await prismaClient.user.create({
      data: {
        name: event.name,
        password: event.password,
        email: event.email,
        photo: event.photo,
      },
    });

    if (!data) {
      return {
        success: false,
        message: "Internal Server Error",
      };
    }

    const token = jwt.sign({ userId: data.email }, JWT_SECRET);

    return {
      success: true,
      message: "Register Successful",
      data: {
        email: data.email,
        name: data.name,
        token: token,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
    };
  }
};

export const crateRoomService = async (event: any, userId: string) => {
  const data = await prismaClient.room.create({
    data: {
      slug: event.slug,
      adminId: userId,
    },
  });

  if (!data) {
    return {
      success: false,
      message: "Internal Server Error",
    };
  }

  return {
    success: true,
    roomId: data.id,
  };
};
