import axios from "axios";
import { IUser, IUserRequest } from "@shared/types";
import { NetworkSettings } from "../../Settings";
import StorageService from "./StorageService";

const USER_DATABASE_URL = `${NetworkSettings.serverUrl}/users`;
const GET_USER_URL = `${USER_DATABASE_URL}/get`;
const GET_ALL_USERS_URL = `${USER_DATABASE_URL}/getAll`;

class UserService {
    private static getAuthHeaders() {
        const token = StorageService.GetAccessToken();
        if (!token) {
            throw new Error('No access token found');
        }
        return {
            accessToken: token
        };
    }

    static async GetAllUsers(): Promise<IUser[] | undefined> {
        try {
            const response = await axios.get(GET_ALL_USERS_URL, {
                headers: this.getAuthHeaders()
            });
            
            if (response?.data?.data) {
                return response.data.data;
            }
            throw new Error('Invalid response format');
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Unauthorized: Please log in again');
                }
                throw new Error(error.response?.data?.message || 'Failed to fetch users');
            }
            throw error;
        }
    }

    static async GetUser(request: IUserRequest): Promise<IUser | undefined> {
        try {
            const response = await axios.get(GET_USER_URL, {
                headers: this.getAuthHeaders(),
                params: {id: request.id, email: request.email, name: request.name}
            });
            
            if (response?.data?.data) {
                return response.data.data;
            }
            throw new Error('Invalid response format');
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Unauthorized: Please log in again');
                }
                throw new Error(error.response?.data?.message || 'Failed to fetch user');
            }
            throw error;
        }
    }

    static async DeleteUser(request: IUserRequest): Promise<void> {
        if (!request.id) {
            throw new Error('User ID is required for deletion');
        }

        try {
            const response = await axios.delete(`${USER_DATABASE_URL}/${request.id}`, {
                headers: this.getAuthHeaders()
            });

            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to delete user');
            }
            else {
                console.log("Delete User - Success Response:", response.data);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    console.log("Delete User - Error Response:", error.response);
                    throw new Error('Unauthorized: Please log in again');
                }
                console.log("Delete User - Error Response:", error.response);
                throw new Error(error.response?.data?.message || 'Failed to delete user');
            }
            throw error;
        }
    }

    static async GetUserByEmail(email: string): Promise<IUser | undefined> {
        return await this.GetUser({ email });
    }

    static async GetUserById(id: number): Promise<IUser | undefined> {
        return await this.GetUser({ id });
    }

    static async GetUserByName(name: string): Promise<IUser | undefined> {
        return await this.GetUser({ name });
    }
}

export default UserService;
