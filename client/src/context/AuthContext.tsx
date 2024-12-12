import { createContext } from "react";
import { IUser } from "@shared/types";

export type AuthContextValues = {
  status: boolean,
  user?: IUser,
}

interface AuthContextProps extends AuthContextValues {
  setAuthContext: (values: AuthContextValues) => void
}

export const AuthContext = createContext<AuthContextProps>({
  status: false,
  user: undefined,
  setAuthContext: () => {}
});

