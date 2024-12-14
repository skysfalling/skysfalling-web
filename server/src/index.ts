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
  try {
    await dbConfig.sequelize.sync();

    // Get both schema and table statistics in a single query
    const [schemaInfo, tableStats] = await Promise.all([
      // Query for schema information
      dbConfig.sequelize.query(
        `
        SELECT 
          TABLE_NAME as tableName,
          COLUMN_NAME as columnName,
          DATA_TYPE as dataType,
          COLUMN_KEY as columnKey,
          (
            SELECT TABLE_ROWS 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = COLUMNS.TABLE_SCHEMA 
            AND TABLE_NAME = COLUMNS.TABLE_NAME
          ) as rowCount
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = ?
        ORDER BY TABLE_NAME, ORDINAL_POSITION
      `, {
        replacements: [config.database],
        type: QueryTypes.SELECT
      }),

      // Query for table statistics
      dbConfig.sequelize.query(
        `
        SELECT 
          TABLE_NAME as tableName,
          TABLE_ROWS as rowCount
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_SCHEMA = ?
      `, {
        replacements: [config.database],
        type: QueryTypes.SELECT
      })
    ]);

    // Create a map of table names to row counts for quick lookup
    const tableRowCounts = new Map(
      tableStats.map((stat: any) => [stat.tableName, stat.rowCount])
    );

    // Group columns by table
    const tableSchemas = schemaInfo.reduce((acc: any, schema: any) => {
      if (!acc[schema.tableName]) {
        acc[schema.tableName] = [];
      }
      acc[schema.tableName].push(schema);
      return acc;
    }, {} as Record<string, typeof schemaInfo>);

    // Print the formatted output
    console.log('\n---> Database Schemas:');
    
    Object.entries(tableSchemas).forEach(([tableName, columns]: any) => {
      const rowCount = tableRowCounts.get(tableName) || 0;
      console.log(`\nTable: ${tableName} (${rowCount} rows)`);
      
      columns.forEach((column: any) => {
        console.log(
          `    - ${column.columnName} (${column.dataType})` +
          `${column.columnKey === 'PRI' ? ' PRIMARY KEY' : ''}`
        );
      });
    });

  } catch (error) {
    console.error('Error fetching schema information:', error);
  }
}

