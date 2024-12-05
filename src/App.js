import React, { useState } from 'react';
import './App.css';
import BkgImage from './images/electricjellyfish.jpg';
import AuthSignIn from './components/AuthSignIn';
import UserInfoCard from './components/UserInfoCard';

const googleClientId = "537411566483-gcsvpnd96ok17rn6h5vlvukk0cgjactb.apps.googleusercontent.com";

function App() {
    const [user, setUser] = useState(null);

    const handleSignIn = (newUser) => {
        setUser(newUser);
    };

    return (
        <div className="App">
            <Section img_bg={BkgImage}>
            </Section>


            <UserInfoCard user={user} onUserUpdate={setUser} />
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
