import { AuthContext, UserContext } from "../../../context";
import { AuthService } from "../../../classes/AuthService";
import { useContext } from "react";

export function Logout() {
  const authContext = useContext(AuthContext);
  const userContext = useContext(UserContext);

  return <div>
    <button onClick={() => {
      const authService = new AuthService(authContext.setAuthState, userContext.setUserData);
      authService.Logout();
    }}>
      Logout
    </button>
  </div>
}
