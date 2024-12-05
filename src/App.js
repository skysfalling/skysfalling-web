import React from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import BkgImage from './images/electricjellyfish.jpg';
import UserProfileCard from './components/User/UserProfileCard.tsx';
import AuthSignIn from './components/Auth/AuthSignIn.tsx';
import EmailForm from './components/EmailForm/EmailForm.tsx';
import UserModel from './models/UserModel.tsx';
import UserPage from './pages/UserPage.jsx';
import GamePage from './pages/GamePage.jsx';

function NavigationButtons() {
  const navigate = useNavigate();

  return (
    <div className="navigation-buttons">
      <button onClick={() => navigate('/user')}>Go to User Page</button>
      <button onClick={() => navigate('/game')}>Go to Game Page</button>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
}

function App() {
    const defaultUser = UserModel.DefaultUser();

    const handleSignIn = (user) => {
        console.log(user);
    }

    return (
        <div className="App">
            <BrowserRouter>
                <Section img_bg={BkgImage}>
                </Section>

                <NavigationButtons />

                <Routes>
                    <Route path="/" element={
                        <div className="components-grid">
                            <div className="grid-item">
                                <UserProfileCard user={defaultUser} />
                            </div>
                            <div className="grid-item">
                                <AuthSignIn onSignIn={handleSignIn} />
                            </div>
                            <div className="grid-item">
                                <EmailForm />
                            </div>
                        </div>
                    } />
                    <Route path="/user" element={<UserPage />} />
                    <Route path="/game" element={<GamePage />} />
                </Routes>
            </BrowserRouter>
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
