import axios from "axios";
import { IUser, IUserRequest, IUserResponse } from "@shared/types";
import { NetworkSettings } from "../Settings";

const USER_DATABASE_URL = `${NetworkSettings.serverUrl}`;
const GET_USER_URL = `${USER_DATABASE_URL}/users/get`;


export class UserService {

    async GetUser(request: IUserRequest): Promise<IUser | undefined> {
        try {
            const response = await axios.get(GET_USER_URL,{
                params: {id: request.id, email: request.email, name: request.name}
            });
            if (response){
                const user : IUser = response.data.data;
                return user;
            }
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                // Log the error message and additional details for better debugging.
                console.error("Error fetching user by email:", error.message);
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.error("Response data:", error.response.data); // Log the response data
                } else if (error.request) {
                    // The request was made but no response was received
                    console.error("Request data:", error.request); // Log the request data
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error("Error message:", error.message);
                }
            }
            return undefined; // Return undefined in case of an error
        }
    }

    async GetUserByEmail(email:string): Promise<IUser | undefined> {
        return await this.GetUser({ email });
    }

    async GetUserById(id:number): Promise<IUser | undefined> {
        return await this.GetUser({ id });
    }

    async GetUserByName(name:string): Promise<IUser | undefined> {
        return await this.GetUser({ name });
    }
}
