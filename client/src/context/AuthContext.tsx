import { createContext } from "react";

/**
 * The properties for the authentication context
 */
export interface AuthContextProps {
  /** The authentication state */
  authState: boolean;
  /** The function to set the authentication state */
  setAuthState: (setTo: boolean) => void;
}

/**
 * The context for the authentication state
 */
export const AuthContext = createContext<AuthContextProps>({
  authState: false,
  setAuthState: (setTo: boolean) => { },
});