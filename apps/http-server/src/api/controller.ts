import { crateRoomService, LoginService, RegisterService } from "./service.js";

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
