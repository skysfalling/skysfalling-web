import { AuthContext, AuthService } from "../../../context/AuthContext";
import { useContext } from "react";

export function Logout() {
  const authContext = useContext(AuthContext);
  return <div className="card-container">
    <button onClick={() => {
      const authService = new AuthService(authContext.setAuthState);
      authService.Logout();
    }}>
      Logout
    </button>
  </div>
}
