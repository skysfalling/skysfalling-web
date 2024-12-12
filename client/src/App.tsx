import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthService } from "./classes/AuthService";
import Navbar from "./components/Navbar";
import { AuthContext, AuthContextValues } from "./context";
import type NavLink from "./interfaces/NavLink";
import { Gallery, Home, Profile } from "./layouts";
import "./styles/main.css";

const navLinks: NavLink[] = [
  { to: "/", label: "Home", component: Home },
  { to: "/gallery", label: "Gallery", component: Gallery },
  { to: "/profile", label: "Profile", component: Profile },
];

function App() {
  // Define auth state and user state separately for better control
  const [authContext, setAuthContext] = useState<AuthContextValues>({
    status: false,
    user: undefined,
  });
  const [checkAuth, setCheckAuth] = useState<boolean>(false);

  useEffect(() => {
    if (!checkAuth) {
      const authService = new AuthService(setAuthContext);
      authService.CheckAuth();
      setCheckAuth(true);
    }
  }, [checkAuth, authContext]);

  return (
    <AuthContext.Provider value={{ ...authContext, setAuthContext }}>
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
    </AuthContext.Provider>
  );
}

export default App;
