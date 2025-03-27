import { crateRoomService, getRoomService, getSlugService, LoginService, RegisterService } from "./service.js";

export const LoginController = async (event: any) => {
  const result = await LoginService(event);
  return result;
};

export const RegisterController = async (event: any) => {
  const result = await RegisterService(event);
  return result;
};

export const crateRoomController = async (event: any, userId: string) => {
  const result = await crateRoomService(event, userId);
  return result;
};

export const getRoomController = async (roomId: string) => {
  const result = await getRoomService(roomId);
  return result;
};


export const getSlugController = async (slug: string) => {
  const result = await getSlugService(slug);
  return result;
}

