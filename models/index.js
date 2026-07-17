import Department from './departmentModel.js';
import Employee from './employeeModel.js';

// Setup relationships
Department.hasMany(Employee, { foreignKey: 'departmentId', as: 'employees' });
Employee.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });

export {
  Department,
  Employee
};
export default {
  Department,
  Employee
};
