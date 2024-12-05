import express from "express";
import mysql from 'mysql2';
import cors from "cors";

const BACKEND_PORT = 8800;
const MYSQL_HOST = "localhost";
const MYSQL_USER = "root";
const MYSQL_PASSWORD = "Obi1Kenobi_";
const MYSQL_DATABASE = "skysfalling";

const app = express();
app.use(cors());
app.use(express.json());

// Create the connection pool instead of a single connection
const db = mysql.createPool({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
}).promise(); // Add .promise() for better async handling

// Get the homepage, (request, response)
app.get("/", (req, res) => {
  res.json("Hello World");
});

// Get all the users from the database
app.get("/users", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    console.log(rows);
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.json(err);
  }
});

app.listen(BACKEND_PORT, () => {
  console.log(`Connected to backend on port ${BACKEND_PORT}`);
});