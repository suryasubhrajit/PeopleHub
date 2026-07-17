import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

// Define the Department model
const Department = sequelize.define('Department', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  departmentName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'departments',
  timestamps: true,      // Enable timestamps
  updatedAt: false       // Disable updatedAt since our database schema doesn't have it
});

export default Department;
