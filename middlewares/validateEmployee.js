import { Op } from 'sequelize';
import { Employee, Department } from '../models/index.js';

// Middleware to validate employee inputs
export default async function validateEmployee(req, res, next) {
  try {
    const employeeCode = req.body.employeeCode;
    const fullName = req.body.fullName;
    const email = req.body.email;
    const mobile = req.body.mobile;
    const departmentId = req.body.departmentId;

    const isUpdate = req.params.id !== undefined && req.params.id !== null;
    const employeeId = req.params.id;

    const errors = [];

    // 1. Full Name is mandatory
    if (fullName === undefined || fullName === null || fullName.trim() === '') {
      errors.push({ field: 'fullName', message: 'Full Name is mandatory' });
    }

    // 2. Mobile validation: should contain only digits
    if (mobile !== undefined && mobile !== null && mobile !== '') {
      if (typeof mobile !== 'string' || !/^\d+$/.test(mobile)) {
        errors.push({ field: 'mobile', message: 'Mobile should contain only digits' });
      }
    }

    // 3. Employee Code uniqueness check
    if (employeeCode === undefined || employeeCode === null || employeeCode.trim() === '') {
      errors.push({ field: 'employeeCode', message: 'Employee Code is mandatory' });
    } else {
      const trimmedCode = employeeCode.trim();
      let queryOptions = {
        where: {
          employeeCode: trimmedCode
        }
      };

      // If we are updating, exclude current employee id
      if (isUpdate === true) {
        queryOptions.where.id = {
          [Op.ne]: employeeId
        };
      }

      const existingEmployee = await Employee.findOne(queryOptions);
      if (existingEmployee !== null) {
        errors.push({ field: 'employeeCode', message: 'Employee Code must be unique' });
      }
    }

    // 4. Email uniqueness check
    if (email === undefined || email === null || email.trim() === '') {
      errors.push({ field: 'email', message: 'Email is mandatory' });
    } else {
      const trimmedEmail = email.trim();
      if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
        errors.push({ field: 'email', message: 'Invalid email format' });
      } else {
        let queryOptions = {
          where: {
            email: trimmedEmail
          }
        };

        // If we are updating, exclude current employee id
        if (isUpdate === true) {
          queryOptions.where.id = {
            [Op.ne]: employeeId
          };
        }

        const existingEmail = await Employee.findOne(queryOptions);
        if (existingEmail !== null) {
          errors.push({ field: 'email', message: 'Email must be unique' });
        }
      }
    }

    // 5. Department existence check
    if (departmentId === undefined || departmentId === null || departmentId === '') {
      errors.push({ field: 'departmentId', message: 'Department ID is mandatory' });
    } else {
      const dept = await Department.findByPk(departmentId);
      if (dept === null) {
        errors.push({ field: 'departmentId', message: 'Department must exist' });
      }
    }

    // If there are errors, return bad request status
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}
