import { AuthContext } from "../../../context";
import { AuthService } from "../../../classes/AuthService";
import { useContext } from "react";

export function Logout() {
  const authContext = useContext(AuthContext);
  const service = new AuthService(authContext.setAuthContext);
  return <div>
    <button onClick={service.Logout}>Logout</button>
  </div>
}
