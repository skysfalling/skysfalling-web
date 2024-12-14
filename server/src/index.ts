"use strict";

import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/UserRoutes";
import config from "./config/config";
import dbConfig from "./models";
import path from "path";
import { QueryTypes } from 'sequelize';

// ====================== << DOTENV VARIABLES >> ======================
/**
 * Load environment variables from .env file
 * @link https://www.npmjs.com/package/dotenv
 */
dotenv.config({ path: "../.env" });
if (!process.env.MYSQLDATABASE) {
  console.error('Environment variables not loaded! Current working directory:', process.cwd());
  console.error('Attempted to load from:', path.resolve("../.env"));
  throw new Error('Environment variables not loaded!');
}

// ====================== << TESTING CONNECTION >> ======================

// ====================== << EXPRESS APP INSTANCE >> ======================
const app: Express = express();
app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);

// ====================== << SERVER LISTENERS >> ======================
// Database connection and server start
dbConfig.sequelize.authenticate().then(async () => {
  console.log("Database connection established successfully.");
})
.catch((error: any) => {
  console.error("Unable to connect to the database:", error);
});

dbConfig.sequelize.sync().then(async () => {
  app.listen(config.port, () => {
    console.log(`Server running at: http://${config.host}:${config.port}`);
  });
});

async function printDatabase() {
  dbConfig.sequelize.sync().then(async () => {
    // Query to get all tables and their schemas
    const [schemas] = await dbConfig.sequelize.query(
      `SELECT 
          TABLE_NAME as tableName,
          COLUMN_NAME as columnName,
          DATA_TYPE as dataType,
          IS_NULLABLE as isNullable,
          COLUMN_DEFAULT as defaultValue,
          COLUMN_KEY as columnKey
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = ?
        ORDER BY TABLE_NAME, ORDINAL_POSITION`,
      {
        replacements: [config.database],
        type: QueryTypes.SELECT
      }
    );

    // Log the schema information in a structured way
    console.log('\n---> Database Schemas:');
    let currentTable = '';

    schemas.forEach((column: any) => {
      if (currentTable !== column.tableName) {
        currentTable = column.tableName;
        console.log(`\n  Table: ${currentTable}`);
      }
      console.log(`    - ${column.columnName} (${column.dataType})${column.columnKey === 'PRI' ? ' PRIMARY KEY' : ''}`);
    });

  }).catch((error: any) => {
    console.error('Error fetching schema information:', error);
  });
}