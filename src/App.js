import React from 'react';
import './App.css';
import BkgImage from './images/electricjellyfish.jpg';
import UserProfileCard from './components/User/UserProfileCard.tsx';
import AuthSignIn from './components/Auth/AuthSignIn.tsx';
import EmailForm from './components/EmailForm/EmailForm.tsx';
import UserModel from './models/UserModel.tsx';

function App() {
    const defaultUser = UserModel.DefaultUser();

    const handleSignIn = (user) => {
        console.log(user);
    }

    return (
        <div className="App">
            <Section img_bg={BkgImage}>

            </Section>

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
