import express from 'express';
import dashboardController from '../controllers/dashboardController.js';

const { getDashboardStats } = dashboardController;

const router = express.Router();

router.get('/', getDashboardStats);

export default router;
