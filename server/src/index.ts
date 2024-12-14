"use strict";

import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/UserRoutes";
import db from "./models";
import path from "path";

// ====================== << DOTENV VARIABLES >> ======================
/**
 * Load environment variables from .env file
 * @link https://www.npmjs.com/package/dotenv
 */
dotenv.config({ path: "../.env" });
if (!process.env.MYSQLDATABASE) {
  console.error('Environment variables not loaded! Current working directory:', process.cwd());
  console.error('Attempted to load from:', path.resolve("../.env"));
}
else {
  console.log('---> ENV:', {
    database: process.env.MYSQLDATABASE,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD?.substring(0, 3) + '***', // Only show first 3 chars of password
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
  });
}
// ====================== << TESTING CONNECTION >> ======================
console.log("---->   MODELS:\n", db.sequelize.models);

// ====================== << EXPRESS APP INSTANCE >> ======================
const app: Express = express();
app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);

// ====================== << SERVER LISTENERS >> ======================
// Database connection and server start
db.sequelize.authenticate()
  .then(() => {
    console.log("Database connection established successfully.");
    return db.sequelize.sync(); // This creates the tables if they don't exist
  })
  .then(() => {
    app.listen(process.env.MYSQLPORT, () => {
      console.log(`Server running on port ${process.env.MYSQLPORT}`);
    });
  })
  .catch((error: any) => {
    console.error("Unable to connect to the database:", error);
  });
