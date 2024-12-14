import React, { useState, useEffect } from "react";
import { NetworkConfig } from "../../config";
import UserService from "../../classes/services/UserService";
import ErrorService from "shared/ErrorService";


import "./Home.styles.css";

const Home = () => {
  const [welcomeResponse, setWelcomeResponse] = useState(">:(");

  useEffect(() => {
    const welcome = async () => {
      const response = await UserService.GetWelcome();
      console.log("GetWelcome response: ", response);
      setWelcomeResponse(response?.message || ">:(");
    };
    welcome();
  }, []);

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <section className="home-page">
        <h1>Home</h1>
        <p>{welcomeResponse}</p>
      </section>

      <div
        className="debug-environment-variables"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "var(--theme-background-dark)",
          color: "var(--theme-text-light)",
          borderRadius: "0.5em",
          margin: "1em 0",
          padding: "1em",
          gap: "1em",
        }}
      >
        <h3>Network Settings</h3>
        <div style={{
          gap: "0.5em"
        }}>
          { Object.entries(NetworkConfig).map(([key, value]) => (
            <div key={key}>
              <p><strong>{key}</strong>: {value}</p>
            </div>
          ))
        }
        </div>
      </div>
    </div>
  );
};

export default Home;
