"use strict";

import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/UserRoutes";
import config from "./config";
import dbConfig from "./models";
import path from "path";
import { QueryTypes } from 'sequelize';

// ====================== << DOTENV VARIABLES >> ======================
/**
 * Load environment variables from .env file
 * @link https://www.npmjs.com/package/dotenv
 */
dotenv.config({ path: "../.env" });
if (!config.database) {
  console.error('Environment variables not loaded! Current working directory:', process.cwd());
  console.error('Attempted to load from:', path.resolve("../.env"));
  throw new Error('Environment variables not loaded!');
}




// ====================== << TESTING MySQL DATABASE CONNECTION >> ======================
// Log connection details (for debugging)
console.log('Attempting MySQL Database connection with:', {
  host: config.database.host,
  port: config.database.port,
  database: config.database.database,
  username: config.database.username,
  password: config.database.password ? '****' : 'not set'
});

// Database connection and server start
dbConfig.sequelize.authenticate()
  .then(() => {
    console.log(`Database connection established successfully at ${config.database.host}:${config.database.port}`);

  })
  .catch((error: any) => {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Exit the process on connection failure
  });



// ====================== << EXPRESS APP SERVER INSTANCE >> ======================
const app: Express = express();
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://skysfalling-web.netlify.app', /\.netlify\.app$/]
    : ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/users", userRoutes);


console.log('Attempting Server connection with:', {
  host: config.server.host,
  port: config.server.port
});

// Start the server only after successful database connection
app.listen(config.server.port, config.server.host, () => {
  console.log(`Server running at http://${config.server.host}:${config.server.port}`);
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

