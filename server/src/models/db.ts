import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// For development, use config.json values if env vars are not set
const config = require('../config/config.json')['development'];

export const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || config.database,
  process.env.MYSQL_USER || config.username,
  process.env.MYSQL_PASSWORD || config.password,
  {
    host: process.env.MYSQL_HOST || config.host,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);