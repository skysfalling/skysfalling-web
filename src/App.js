import React from 'react';
import './App.css';
import BkgImage from './images/electricjellyfish.jpg';
import UserProfileCard from './components/User/UserProfileCard.tsx';
function App() {

    return (
        <div className="App">
            <Section img_bg={BkgImage}>
            </Section>

            <UserProfileCard user={null} />
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
