import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import type NavLink from './interfaces/NavLink'; // type from interface

// ( Styles ) ----------------
import './styles/main.css';

// ( Pages ) ----------------
import { Home } from './layouts';
import { UserGallery, UserLogin, UserProfile } from './layouts';

const navLinks: NavLink[] = [
  { to: '/', label: 'Home', component: Home },
  { to: '/gallery', label: 'Gallery', component: UserGallery },
  { to: '/login', label: 'Login', component: UserLogin },
  { to: '/profile', label: 'Profile', component: UserProfile },
];

function App()
{

  return (
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
  );
};

export default App;
