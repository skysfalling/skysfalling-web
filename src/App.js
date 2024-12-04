import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import backgroundImage from './images/electricjellyfish.jpg';
import AuthLoginButton from './components/AuthLoginButton';
import GithubLoginButton from './components/GithubLoginButton';
import GithubCallback from './components/GithubCallback';

const googleClientId = "537411566483-gcsvpnd96ok17rn6h5vlvukk0cgjactb.apps.googleusercontent.com";

function App() {
  return (
    <Router>
      <div className="App">
        <Section img_bg={backgroundImage}>
          <Routes>
            <Route path="/github/callback" element={<GithubCallback />} />
            <Route path="/" element={
              <>
                <GoogleOAuthProvider clientId={googleClientId}>
                  <AuthLoginButton />
                </GoogleOAuthProvider>
                <GithubLoginButton />
              </>
            } />
          </Routes>
        </Section>
      </div>
    </Router>
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
