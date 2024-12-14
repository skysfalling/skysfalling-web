import dotenv from "dotenv";
dotenv.config();

interface Config {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
}

// Validate required environment variables
const requiredEnvVars = ['MYSQLUSER', 'MYSQLPASSWORD', 'MYSQLDATABASE', 'MYSQLHOST', 'MYSQLPORT'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

const config: Config = {
  username: process.env.MYSQLUSER!,
  password: process.env.MYSQLPASSWORD!,
  database: process.env.MYSQLDATABASE!,
  host: process.env.MYSQLHOST!,
  port: parseInt(process.env.MYSQLPORT!, 10)
};

// Validate configuration
Object.entries(config).forEach(([key, value]) => {
  if (!value && value !== 0) {
    throw new Error(`Invalid configuration: ${key} is ${value}`);
  }
});

export default config;