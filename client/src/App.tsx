import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthContext, UserContext } from "./context";
import type NavLink from "./interfaces/NavLink"; // type from interface
// ( Styles ) ----------------
import "./styles/main.css";

// ( Pages ) ----------------
import { Gallery, Home, Profile } from "./layouts";
import { AuthService } from "./classes/AuthService";
import { UserData } from "./interfaces";

const navLinks: NavLink[] = [
  { to: "/", label: "Home", component: Home },
  { to: "/gallery", label: "Gallery", component: Gallery },
  { to: "/profile", label: "Profile", component: Profile },
];

function App() {
  const [authState, setAuthState] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | undefined>(undefined);
  const [checkAuth, setCheckAuth] = useState<boolean>(false);

  useEffect(() => {
    if (!checkAuth)
    {
      const authService = new AuthService(setAuthState, setUserData);
      authService.CheckAuth();
      setCheckAuth(true);
    }
  }, [authState, checkAuth]);

  return (
    <AuthContext.Provider value={{authState, setAuthState}}>
      <UserContext.Provider value={{userData, setUserData}}>
        <Router>
          <div className="App">
            <Navbar links={navLinks} />
            <main>
              <Routes>
                {navLinks.map(({ to, component: Component }) => (
                  <Route key={to} path={to} element={<Component />} />
                ))}
              </Routes>
            </main>
          </div>
        </Router>
      </UserContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
