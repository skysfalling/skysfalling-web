import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import type NavLink from './interfaces/NavLink'; // type from interface
import { AuthContext } from './context/AuthContext';

// ( Styles ) ----------------
import './styles/main.css';

// ( Pages ) ----------------
import { Home } from './layouts';
import { UserGallery, UserProfile } from './layouts';

const navLinks: NavLink[] = [
  { to: '/', label: 'Home', component: Home },
  { to: '/gallery', label: 'Gallery', component: UserGallery },
  { to: '/profile', label: 'Profile', component: UserProfile },
];

function App()
{
  const [authState, setAuthState] = useState<boolean>(false);
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
};

export default App;
