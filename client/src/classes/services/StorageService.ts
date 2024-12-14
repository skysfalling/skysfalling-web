import { UserConfig } from "../../config";

const USER_ACCESS_TOKEN_KEY = `${UserConfig.accessTokenKey}`;

class StorageService {
    static GetAccessToken(): string | undefined {
        const accessToken = localStorage.getItem(USER_ACCESS_TOKEN_KEY);
        if (accessToken) {
          return accessToken;
        }
        return undefined;
      }
    
    static SetAccessToken(accessToken: string | undefined): void {
        if (accessToken) {
          localStorage.setItem(USER_ACCESS_TOKEN_KEY, accessToken);
        }
        else {
          console.error("Cannot set undefined access token");
        }
      }
    
    static RemoveAccessToken(): void {
        localStorage.removeItem(USER_ACCESS_TOKEN_KEY);
    }
}

export default StorageService;
