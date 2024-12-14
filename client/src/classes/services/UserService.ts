import axios, { AxiosResponse } from "axios";
import { IApiResponse, IUser, IUserRequest } from "shared/interfaces";
import { NetworkConfig } from "../../config";
import AuthService from "./AuthService";
import ErrorService from "shared/ErrorService";

const USER_DATABASE_URL = `${NetworkConfig.serverUrl}/users`;
const GET_WELCOME_URL = `${USER_DATABASE_URL}/`;
const GET_USER_URL = `${USER_DATABASE_URL}/get`;
const GET_ALL_USERS_URL = `${USER_DATABASE_URL}/getAll`;
const EDIT_USER_URL = `${USER_DATABASE_URL}/edit`;

const USER_SERVICE_PREFIX = "[UserService] : ";
const GET_WELCOME_PREFIX = `${USER_SERVICE_PREFIX} GetWelcome - `;
const GET_ALL_USERS_PREFIX = `${USER_SERVICE_PREFIX} GetAllUsers - `;
const GET_USER_PREFIX = `${USER_SERVICE_PREFIX} GetUser - `;
const EDIT_USER_PREFIX = `${USER_SERVICE_PREFIX} EditUser - `;
const DELETE_USER_PREFIX = `${USER_SERVICE_PREFIX} DeleteUser - `;



class UserService {

    static async GetWelcome(): Promise<IApiResponse | undefined> {

        console.log(`${GET_WELCOME_PREFIX} Request at ${GET_WELCOME_URL}`);
        try {
            const axiosResponse : AxiosResponse = await axios.get(GET_WELCOME_URL);

            if (axiosResponse?.data?.data) {
                return {
                    success: axiosResponse.data.success,
                    status: axiosResponse.status,
                    message: axiosResponse.data.message,
                } as IApiResponse;
            }
        }
        catch (error) {
            ErrorService.LogAPIRequestError(GET_WELCOME_PREFIX, error);
        }
    }


    static async GetAllUsers(): Promise<IUser[] | undefined> {
        console.log(`${GET_ALL_USERS_PREFIX} Request : `);
        try {
            const axiosResponse : AxiosResponse = await axios.get(GET_ALL_USERS_URL);
            console.log(`${GET_ALL_USERS_PREFIX} Response : `, axiosResponse.data);

            if (axiosResponse?.data?.data) {
                return axiosResponse.data.data;
            }
            throw new Error('Invalid response format');
        }
        catch (error) {
            ErrorService.LogAPIRequestError(GET_ALL_USERS_PREFIX, error);
        }
    }

    static async GetUser(request: IUserRequest): Promise<IUser | undefined> {
        console.log(`${GET_USER_PREFIX} Request : `, request);
        try {
            const axiosResponse : AxiosResponse = await axios.get(GET_USER_URL, {
                params: {id: request.id, email: request.email, name: request.name}
            });

            console.log(`${GET_USER_PREFIX} Axios Response : `, axiosResponse);

            if (axiosResponse?.data?.data) {
                return axiosResponse.data.data;
            }
            throw new Error('Invalid response format');
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(`${GET_USER_PREFIX} Axios Error : `, error.response);
                throw new Error(error.response?.data?.message || 'Failed to fetch user');
            }
            else if (error instanceof Error) {
                console.log(`${GET_USER_PREFIX} Error : `, error);
                throw new Error(error.message || 'Failed to fetch user');
            }
            throw error;
        }
    }

    static async EditUser(request: IUserRequest , updatedData: Partial<IUser>): Promise<void> {
        console.log(`${EDIT_USER_PREFIX} Request : `, request);
        try {
            const axiosResponse : AxiosResponse = await axios.put(`${USER_DATABASE_URL}/edit`, {
                params: {
                    userId: request.id,
                },
                headers: AuthService.GetAuthHeaders()
            });

            if (!axiosResponse.data.success) {
                throw new Error(axiosResponse.data.message || 'Failed to update user');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Unauthorized: Please log in again');
                }
                throw new Error(error.response?.data?.message || 'Failed to update user');
            }
            throw error;
        }
    }

    static async DeleteUser(request: IUserRequest): Promise<void> {
        console.log(`${DELETE_USER_PREFIX} Request : `, request);
        if (!request.id) {
            throw new Error('User ID is required for deletion');
        }

        try {
            const axiosResponse : AxiosResponse = await axios.delete(`${USER_DATABASE_URL}/${request.id}`, {
                headers: AuthService.GetAuthHeaders()
            });

            console.log(`${DELETE_USER_PREFIX} Response : `, axiosResponse);

            if (!axiosResponse.data.success) {
                throw new Error(axiosResponse.data.message || 'Failed to delete user');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Unauthorized: Please log in again');
                }
                throw new Error(error.response?.data?.message || 'Failed to delete user');
            }
            throw error;
        }
    }
}

export default UserService;
