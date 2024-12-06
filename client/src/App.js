import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import BkgImage from './images/electricjellyfish.jpg';
import Home from './pages/Home.js';
import Games from './pages/Games.js';
import Users from './pages/Users.js';
import Login from './pages/Login.js';
import './App.css';
import Navbar from './components/Navbar/Navbar';

function App() {
    return (
        <div className="App">
            <Router>
                <Navbar />
                <Section img_bg={BkgImage}>
                </Section>
                <Routes>
                    <Route path="/" exact element={<Home />} />
                    <Route path="/user" element={<Users />} />
                    <Route path="/game" element={<Games />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Router>
        </div>
    );
}

const Section = ({ img_bg, children }) => {
    return (
        <section className="section pentagon-down" style={{ backgroundImage: `url(${img_bg})` }}>
            {children}
        </section>
    );
}
export default App;
