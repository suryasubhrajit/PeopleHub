import { Sequelize } from 'sequelize';
import 'dotenv/config';

// Create a new Sequelize instance with config from .env
const sequelize = new Sequelize(
  process.env.DB_NAME || 'people_hub',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'root',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false, // Turn off sql log in console to keep terminal clean
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test database connection immediately
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully to ' + (process.env.DB_NAME || 'people_hub'));
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
})();

export default sequelize;
