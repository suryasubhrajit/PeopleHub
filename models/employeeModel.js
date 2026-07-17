import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

// Define the Employee model
const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  employeeCode: {
    type: DataTypes.STRING(20),
    unique: true
  },
  fullName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true
  },
  mobile: {
    type: DataTypes.STRING(15)
  },
  departmentId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'departments',
      key: 'id'
    }
  },
  designation: {
    type: DataTypes.STRING(100)
  },
  salary: {
    type: DataTypes.DECIMAL(10, 2)
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    defaultValue: 'Active'
  }
}, {
  tableName: 'employees',
  timestamps: true,      // Enable timestamps
  updatedAt: false       // Disable updatedAt since our database schema doesn't have it
});

export default Employee;
