import { Op } from 'sequelize';
import { Employee, Department } from '../models/index.js';

const employeeController = {
  addEmployee: async (req, res, next) => {
    try {
      const {
        employeeCode,
        fullName,
        email,
        mobile,
        departmentId,
        designation,
        salary,
        status
      } = req.body || {};

      // insert employee
      const newEmp = await Employee.create({
        employeeCode,
        fullName,
        email,
        mobile: mobile || null,
        departmentId,
        designation: designation || null,
        salary: salary || null,
        status: status || 'Active'
      });

      return res.status(201).json({
        success: true,
        message: 'Employee added successfully',
        data: newEmp
      });
    } catch (error) {
      next(error);
    }
  },

  listEmployees: async (req, res, next) => {
    try {
      let page = parseInt(req.query.page);
      if (isNaN(page) || page <= 0) {
        page = 1;
      }
      
      let limit = parseInt(req.query.limit);
      if (isNaN(limit) || limit <= 0) {
        limit = 10;
      }

      const offset = (page - 1) * limit;

      const { search, departmentId, status } = req.query || {};

      // build where filters
      const whereConditions = {};

      if (search !== undefined && search !== '') {
        whereConditions[Op.or] = [
          { fullName: { [Op.like]: '%' + search + '%' } },
          { employeeCode: { [Op.like]: '%' + search + '%' } },
          { email: { [Op.like]: '%' + search + '%' } }
        ];
      }

      if (departmentId !== undefined && departmentId !== '') {
        whereConditions.departmentId = departmentId;
      }

      if (status !== undefined && status !== '') {
        whereConditions.status = status;
      }

      // fetch records
      const result = await Employee.findAndCountAll({
        where: whereConditions,
        limit: limit,
        offset: offset,
        order: [['id', 'DESC']],
        include: [
          {
            model: Department,
            as: 'department',
            attributes: ['departmentName']
          }
        ]
      });

      const total = result.count;
      const rawEmployees = result.rows;

      // map fields to put departmentName at root level
      const employees = [];
      for (let i = 0; i < rawEmployees.length; i++) {
        const emp = rawEmployees[i].toJSON();
        if (emp.department !== null && emp.department !== undefined) {
          emp.departmentName = emp.department.departmentName;
        } else {
          emp.departmentName = null;
        }
        delete emp.department;
        employees.push(emp);
      }

      const totalPages = Math.ceil(total / limit);

      return res.status(200).json({
        success: true,
        pagination: {
          total: total,
          page: page,
          limit: limit,
          totalPages: totalPages
        },
        data: employees
      });
    } catch (error) {
      next(error);
    }
  },

  getEmployeeById: async (req, res, next) => {
    try {
      const { id } = req.params || {};
      
      const rawEmp = await Employee.findByPk(id, {
        include: [
          {
            model: Department,
            as: 'department',
            attributes: ['departmentName']
          }
        ]
      });

      if (rawEmp === null) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }

      const emp = rawEmp.toJSON();
      if (emp.department !== null && emp.department !== undefined) {
        emp.departmentName = emp.department.departmentName;
      } else {
        emp.departmentName = null;
      }
      delete emp.department;

      return res.status(200).json({
        success: true,
        data: emp
      });
    } catch (error) {
      next(error);
    }
  },

  updateEmployee: async (req, res, next) => {
    try {
      const { id } = req.params || {};
      const {
        employeeCode,
        fullName,
        email,
        mobile,
        departmentId,
        designation,
        salary,
        status
      } = req.body || {};

      // check exists
      const emp = await Employee.findByPk(id);
      if (emp === null) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }

      // update details
      await emp.update({
        employeeCode,
        fullName,
        email,
        mobile: mobile || null,
        departmentId,
        designation: designation || null,
        salary: salary || null,
        status: status || 'Active'
      });

      return res.status(200).json({
        success: true,
        message: 'Employee updated successfully',
        data: emp
      });
    } catch (error) {
      next(error);
    }
  },

  deleteEmployee: async (req, res, next) => {
    try {
      const { id } = req.params || {};

      const emp = await Employee.findByPk(id);
      if (emp === null) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }

      // delete
      await emp.destroy();

      return res.status(200).json({
        success: true,
        message: 'Employee deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  updateEmployeeStatus: async (req, res, next) => {
    try {
      const { id } = req.params || {};
      const { status } = req.body || {};

      // check status
      if (status === undefined || status === null || (status !== 'Active' && status !== 'Inactive')) {
        return res.status(400).json({
          success: false,
          message: "Status must be either 'Active' or 'Inactive'"
        });
      }

      const emp = await Employee.findByPk(id);
      if (emp === null) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }

      // save status
      await emp.update({ status: status });

      return res.status(200).json({
        success: true,
        message: `Employee status updated to ${status} successfully`
      });
    } catch (error) {
      next(error);
    }
  },

  exportEmployeesCsv: async (req, res, next) => {
    try {
      const { search, departmentId, status } = req.query || {};

      const whereConditions = {};

      if (search !== undefined && search !== '') {
        whereConditions[Op.or] = [
          { fullName: { [Op.like]: '%' + search + '%' } },
          { employeeCode: { [Op.like]: '%' + search + '%' } },
          { email: { [Op.like]: '%' + search + '%' } }
        ];
      }

      if (departmentId !== undefined && departmentId !== '') {
        whereConditions.departmentId = departmentId;
      }

      if (status !== undefined && status !== '') {
        whereConditions.status = status;
      }

      // fetch all records
      const rawEmployees = await Employee.findAll({
        where: whereConditions,
        order: [['id', 'DESC']],
        include: [
          {
            model: Department,
            as: 'department',
            attributes: ['departmentName']
          }
        ]
      });

      // build csv headers
      const headers = ['ID', 'Employee Code', 'Full Name', 'Email', 'Mobile', 'Department', 'Designation', 'Salary', 'Status'];
      const csvRows = [];
      csvRows.push(headers.join(','));

      // Helper function inside to escape CSV field values
      function escapeCsvValue(val) {
        if (val === null || val === undefined) {
          return '';
        }
        const strVal = String(val);
        if (strVal.includes(',') || strVal.includes('"') || strVal.includes('\n') || strVal.includes('\r')) {
          const cleanVal = strVal.replace(/"/g, '""');
          return '"' + cleanVal + '"';
        }
        return strVal;
      }

      // loop to create rows
      for (let i = 0; i < rawEmployees.length; i++) {
        const emp = rawEmployees[i].toJSON();
        const departmentName = emp.department ? emp.department.departmentName : 'N/A';
        const row = [
          escapeCsvValue(emp.id),
          escapeCsvValue(emp.employeeCode),
          escapeCsvValue(emp.fullName),
          escapeCsvValue(emp.email),
          escapeCsvValue(emp.mobile),
          escapeCsvValue(departmentName),
          escapeCsvValue(emp.designation),
          escapeCsvValue(emp.salary),
          escapeCsvValue(emp.status)
        ];
        csvRows.push(row.join(','));
      }

      const csvContent = csvRows.join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=employees_export.csv');
      
      return res.status(200).send(csvContent);
    } catch (error) {
      next(error);
    }
  }
};

export default employeeController;
