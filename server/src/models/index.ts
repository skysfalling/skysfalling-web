"use strict";

import fs from "fs";
import path from "path";
import { DataTypes, Sequelize } from "sequelize";

/**
 * Create new Sequelize instance
 * @link https://sequelize.org/docs/v6/getting-started/#connecting-to-a-database
 */
const sequelize = new Sequelize(
  process.env.MYSQLDATABASE || "",
  process.env.MYSQLUSER || "",
  process.env.MYSQLPASSWORD || "",
  {
    host: process.env.MYSQLHOST || "",
    port: parseInt(process.env.MYSQLPORT || "3306"),
    dialect: "mysql",
    logging: false,
    /**
     * Connection pool configuration
     * @link https://sequelize.org/docs/v6/other-topics/connection-pool/
     */
    pool: {
      max: 5, // Maximum number of connection in pool
      min: 0, // Minimum number of connection in pool
      acquire: 30000, // Maximum time (ms) that pool will try to get connection before throwing error
      idle: 10000, // Maximum time (ms) that a connection can be idle before being released
    },
  }
)

const db: any = { sequelize, Sequelize, DataTypes, models: []};

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
        db.models[ModelClass.name] = ModelClass;
      }
    } else {
      // Handle CommonJS exports (module.exports)
      if (typeof model === "function") {
        const ModelClass = model(sequelize, DataTypes);
        db.models[ModelClass.name] = ModelClass;
      }
    }
  });

// Set up associations
Object.keys(db.models).forEach((modelName) => {
  if (db.models[modelName].associate) {
    db.models[modelName].associate(db.models);
  }
});

export { sequelize };
export default db;