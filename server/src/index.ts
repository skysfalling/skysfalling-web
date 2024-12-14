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
else {
  console.log('Environment variables loaded successfully!',
    {
      host: process.env.MYSQLHOST,
      port: process.env.MYSQLPORT,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD?.substring(0, 3) + '********',
      database: process.env.MYSQLDATABASE
    }
  );
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
  app.listen(config.port, '::', () => {
    console.log(`Server listening at: http://${config.host}::${config.port}`);
    printDatabase();
  });
});

async function printDatabase() {
  dbConfig.sequelize.sync().then(async () => {
    // Query to get all tables and their schemas
    const schemas: Array<any> = await dbConfig.sequelize.query(
      `SELECT 
          TABLE_NAME as tableName,
          COLUMN_NAME as columnName,
          DATA_TYPE as dataType,
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

    for (const schema of schemas) {
      if (currentTable !== schema.tableName) 
      {
        if (currentTable !== '') {
          //Print row count
          const rowCount = await dbConfig.sequelize.query(
            `SELECT COUNT(*) FROM ${currentTable}`,
            { type: QueryTypes.SELECT }
          );
          console.log(`  >> Row count: `, rowCount);
        }

        currentTable = schema.tableName;
        console.log(`\n  Table: ${currentTable}`);
      }
      console.log(`    - ${schema.columnName} (${schema.dataType})${schema.columnKey === 'PRI' ? ' PRIMARY KEY' : ''}`);
    }




  }).catch((error: any) => {
    console.error('Error fetching schema information:', error);
  });
}