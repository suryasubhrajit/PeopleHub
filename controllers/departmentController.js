import { Op } from 'sequelize';
import { Department, Employee } from '../models/index.js';

const departmentController = {
  createDepartment: async (req, res, next) => {
    try {
      const { departmentName } = req.body || {};

      // check name
      if (departmentName === undefined || departmentName === null || departmentName.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Department name is mandatory'
        });
      }

      const trimmedName = departmentName.trim();

      // check if duplicate exists
      const existingDept = await Department.findOne({
        where: {
          departmentName: trimmedName
        }
      });

      if (existingDept !== null) {
        return res.status(400).json({
          success: false,
          message: 'Department name already exists'
        });
      }

      // create department
      const newDept = await Department.create({
        departmentName: trimmedName
      });

      return res.status(201).json({
        success: true,
        message: 'Department created successfully',
        data: {
          id: newDept.id,
          departmentName: newDept.departmentName
        }
      });
    } catch (error) {
      next(error);
    }
  },

  listDepartments: async (req, res, next) => {
    try {
      // get list
      const departmentsList = await Department.findAll({
        order: [['createdAt', 'DESC']]
      });

      return res.status(200).json({
        success: true,
        count: departmentsList.length,
        data: departmentsList
      });
    } catch (error) {
      next(error);
    }
  },

  updateDepartment: async (req, res, next) => {
    try {
      const { id } = req.params || {};
      const { departmentName } = req.body || {};

      // check name
      if (departmentName === undefined || departmentName === null || departmentName.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Department name is mandatory'
        });
      }

      const trimmedName = departmentName.trim();

      // check exists
      const dept = await Department.findByPk(id);
      if (dept === null) {
        return res.status(404).json({
          success: false,
          message: 'Department not found'
        });
      }

      // check duplicate name
      const duplicate = await Department.findOne({
        where: {
          departmentName: trimmedName,
          id: {
            [Op.ne]: id
          }
        }
      });

      if (duplicate !== null) {
        return res.status(400).json({
          success: false,
          message: 'Department name already exists'
        });
      }

      // update
      await dept.update({
        departmentName: trimmedName
      });

      return res.status(200).json({
        success: true,
        message: 'Department updated successfully',
        data: {
          id: dept.id,
          departmentName: dept.departmentName
        }
      });
    } catch (error) {
      next(error);
    }
  },

  deleteDepartment: async (req, res, next) => {
    try {
      const { id } = req.params || {};

      // check exists
      const dept = await Department.findByPk(id);
      if (dept === null) {
        return res.status(404).json({
          success: false,
          message: 'Department not found'
        });
      }

      // check employees count
      const employeeCount = await Employee.count({
        where: {
          departmentId: id
        }
      });

      if (employeeCount > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete department: Associated employees exist'
        });
      }

      // delete
      await dept.destroy();

      return res.status(200).json({
        success: true,
        message: 'Department deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

export default departmentController;
