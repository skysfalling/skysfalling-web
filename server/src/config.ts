import dotenv from "dotenv";
dotenv.config();

interface Config {
  server: {
    port: number;
    host: string;
    protocol: string;
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
    port: parseInt(process.env.PORT || process.env.SERVER_PORT || '8080'),
    host: process.env.SERVER_HOST || '0.0.0.0',
    protocol: process.env.NODE_ENV === 'production' ? 'https' : 'http'
  },
  database: {
    username: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || '',
    database: process.env.MYSQLDATABASE || 'railway',
    host: process.env.MYSQLHOST || 'mysql.railway.internal',
    port: parseInt(process.env.MYSQLPORT || '3306')
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