"use strict";

import fs from "fs";
import path from "path";
import { DataTypes, Sequelize } from "sequelize";
import config from "../config";

/**
 * Create new Sequelize instance with explicit configuration
 */
const sequelize = new Sequelize({
  database: config.database.database,
  username: config.database.username,
  password: config.database.password,
  host: config.database.host,
  port: config.database.port,
  dialect: "mysql",
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Log connection details (for debugging)
console.log('Attempting database connection with:', {
  host: config.database.host,
  port: config.database.port,
  database: config.database.database,
  username: config.database.username,
  // Don't log the full password
  password: config.database.password ? '****' : 'not set'
});

const dbConfig: any = { sequelize, Sequelize, DataTypes, models: [] };

// Get all model files in the current directory
fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && // Ignore hidden files
      file !== path.basename(__filename) && // Ignore this file
      file !== "db.ts" && // Ignore database configuration file
      (file.slice(-3) === ".ts" || file.slice(-3) === ".js") // Only include .ts or .js files
  )
  .forEach((file) => {
    const modelPath = path.join(__dirname, file);
    const model = require(modelPath);

    if (model.default) {
      // Handle ES module exports (export default)
      const ModelClass = model.default;
      if (typeof ModelClass === "function") {
        dbConfig.models[ModelClass.name] = ModelClass;
      }
    } else {
      // Handle CommonJS exports (module.exports)
      if (typeof model === "function") {
        const ModelClass = model(sequelize, DataTypes);
        dbConfig.models[ModelClass.name] = ModelClass;
      }
    }
  });

// Set up associations
Object.keys(dbConfig.models).forEach((modelName) => {
  if (dbConfig.models[modelName].associate) {
    dbConfig.models[modelName].associate(dbConfig.models);
  }
});

export { sequelize };
export default dbConfig;