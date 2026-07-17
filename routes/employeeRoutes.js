import express from 'express';
import employeeController from '../controllers/employeeController.js';
import validateEmployee from '../middlewares/validateEmployee.js';

const {
  addEmployee,
  listEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  updateEmployeeStatus,
  exportEmployeesCsv
} = employeeController;

const router = express.Router();

// GET /employees/export must be defined before GET /employees/:id
router.get('/export', exportEmployeesCsv);

router.route('/')
  .post(validateEmployee, addEmployee)
  .get(listEmployees);

router.route('/:id')
  .get(getEmployeeById)
  .put(validateEmployee, updateEmployee)
  .delete(deleteEmployee);

router.patch('/:id/status', updateEmployeeStatus);

export default router;
