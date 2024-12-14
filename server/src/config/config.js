import dotenv from "dotenv";
dotenv.config();

const config = {
  username: 'root' || process.env.MYSQLUSER,
  password: '' || process.env.MYSQLPASSWORD,
  database: 'skyweb' || process.env.MYSQLDATABASE,
  host: 'localhost' || process.env.MYSQLHOST,
  port: 8080 || process.env.MYSQLPORT
}

export default config;