import { createContext } from "react";
import { IUser } from "@shared/types";

/** Define the values of the AuthContext */
export type AuthContextValues = {
  status: boolean,
  user?: IUser,
}

/** Define the props of the AuthContext constant */
export type AuthContextProps = AuthContextValues & {
  setAuthContext: (values: AuthContextValues) => void
}

/** Create the AuthContext constant */
export const AuthContext = createContext<AuthContextProps>({
  status: false,
  user: undefined,
  setAuthContext: (values: AuthContextValues) => {}
});

