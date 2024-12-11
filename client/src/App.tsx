import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import type NavLink from "./interfaces/NavLink"; // type from interface
import { AuthContext } from "./context/AuthContext";
import { NetworkSettings, UserSettings } from "./Settings";
import axios from "axios";
// ( Styles ) ----------------
import "./styles/main.css";

// ( Pages ) ----------------
import { Home } from "./layouts";
import { Gallery, Profile } from "./layouts";

const ACCESS_TOKEN_KEY = `${UserSettings.accessTokenKey}`;
const navLinks: NavLink[] = [
  { to: "/", label: "Home", component: Home },
  { to: "/gallery", label: "Gallery", component: Gallery },
  { to: "/profile", label: "Profile", component: Profile },
];

function App() {
  const [authState, setAuthState] = useState<boolean>(false);

  /**
   * Check if the user is logged in by checking the access token
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${NetworkSettings.serverUrl}/auth/auth`, {
          headers: {
            accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
          },
        });

        if (!response.data.error) {
          setAuthState(true);
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response?.data.error) {
            // Server responded with error status (4xx, 5xx)
            console.error('Auth check failed:', error.response.data);
          } else if (error.request) {
            // Request made but no response received
            console.error('No response received:', error.request);
          }
        } else {
          // Something else went wrong
          console.error('Error:', error);
        }
        setAuthState(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
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
