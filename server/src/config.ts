import dotenv from "dotenv";
dotenv.config();

interface Config {
  server: {
    port: number;
    host: string;
  };
  database: {
    username: string;
    password: string;
    database: string;
    host: string;
    port: number;
  };
}

const config: Config = {
  server: {
    port: parseInt(process.env.SERVER_PORT || '8080', 10),
    host: process.env.SERVER_HOST || 'localhost'
  },
  database: {
    username: process.env.MYSQLUSER!,
    password: process.env.MYSQLPASSWORD!,
    database: process.env.MYSQLDATABASE!,
    host: process.env.MYSQLHOST!,
    port: parseInt(process.env.MYSQLPORT || '3306', 10)
  }
};

// Validate configuration
if (!config.database.username) {
  console.error('Missing required mysql user');
}

if (!config.database.database) {
  console.error('Missing required mysql database');
}

if (!config.database.host) {
  console.error('Missing required mysql host');
}

if (!config.database.port) {
  console.error('Missing required mysql port');
}

export default config;