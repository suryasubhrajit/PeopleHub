import express from 'express';
import departmentController from '../controllers/departmentController.js';

const { createDepartment, listDepartments, updateDepartment, deleteDepartment } = departmentController;

const router = express.Router();

router.route('/')
  .post(createDepartment)
  .get(listDepartments);

router.route('/:id')
  .put(updateDepartment)
  .delete(deleteDepartment);

export default router;
