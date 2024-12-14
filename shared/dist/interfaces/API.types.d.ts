import { AxiosError } from "axios";
/**
 * Basic API Response Data.
 * All API responses will inherit from this type and all API calls will return this type.
 * @property {boolean} success - Whether the request was successful
 * @property {string} message - A message to the user
 * @property {string} error - An error message
 */
export interface IApiResponse {
    /** (Required) Whether the request was successful */
    success: boolean;
    /** (Required) The status code of the response */
    status: number;
    /** (Optional) A message to the user */
    message?: string;
    /** (Optional) An error message */
    error?: AxiosError | Error | unknown;
}
export declare const NullApiResponse: IApiResponse;
export declare const SuccessApiResponse: IApiResponse;
