import { Department, Employee } from '../models/index.js';

const dashboardController = {
  getDashboardStats: async (req, res, next) => {
    try {
      // count departments
      const totalDepartments = await Department.count();

      // count employees
      const totalEmployees = await Employee.count();

      // get active count and inactive count separately
      const activeCount = await Employee.count({
        where: {
          status: 'Active'
        }
      });

      const inactiveCount = await Employee.count({
        where: {
          status: 'Inactive'
        }
      });

      const statusBreakdown = [
        { status: 'Active', count: activeCount },
        { status: 'Inactive', count: inactiveCount }
      ];

      // get all departments list
      const depts = await Department.findAll();
      
      // loop to get count for each department
      const departmentBreakdown = [];
      for (let i = 0; i < depts.length; i++) {
        const currentDept = depts[i];
        const count = await Employee.count({
          where: {
            departmentId: currentDept.id
          }
        });
        departmentBreakdown.push({
          departmentId: currentDept.id,
          departmentName: currentDept.departmentName,
          employeeCount: count
        });
      }

      // get all employees to calculate salary stats in javascript
      const allEmps = await Employee.findAll();
      
      let sum = 0;
      let max = 0;
      let min = allEmps.length > 0 ? parseFloat(allEmps[0].salary || 0) : 0;

      for (let j = 0; j < allEmps.length; j++) {
        const sal = parseFloat(allEmps[j].salary || 0);
        sum = sum + sal;
        if (sal > max) {
          max = sal;
        }
        if (sal < min) {
          min = sal;
        }
      }

      let avg = 0;
      if (allEmps.length > 0) {
        avg = parseFloat((sum / allEmps.length).toFixed(2));
      }

      return res.status(200).json({
        success: true,
        data: {
          totalDepartments: totalDepartments,
          totalEmployees: totalEmployees,
          statusBreakdown: statusBreakdown,
          departmentBreakdown: departmentBreakdown,
          salaryAnalytics: {
            averageSalary: avg,
            maxSalary: max,
            minSalary: min
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

export default dashboardController;
