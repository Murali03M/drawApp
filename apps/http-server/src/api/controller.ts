import { crateRoomService, LoginService, RegisterService } from "./service";






export const LoginController = (event: any) => {
    
    const result = LoginService(event);

    return result;

    console.log(event);

}

export const RegisterController = (event: any) => {

    const result = RegisterService(event);
    
    console.log(event);
}

export const crateRoomController = async() => {

    const result = await crateRoomService();
    
    return result;

    
};


