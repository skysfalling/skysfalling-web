import { createContext } from "react";
import { UserData } from "../interfaces";

/**
 * The properties for the user context
 */
export interface UserContextProps {
  /** The user data */
  userData?: UserData;
  /** The function to set the user data */
  setUserData: (setTo: UserData | undefined) => void;
}

/**
 * The context for the user state
 */
export const UserContext = createContext<UserContextProps>({
  userData: undefined,
  setUserData(setTo: UserData | undefined) {
    this.userData = setTo;
  },
});


