import dotenv from "dotenv";
dotenv.config();

interface Config {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
}

const config: Config = {
  username: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || '',
  database: process.env.MYSQLDATABASE || '',
  host: process.env.MYSQLHOST || 'localhost',
  port: Number(process.env.MYSQLPORT) || 8080
}

export default config;