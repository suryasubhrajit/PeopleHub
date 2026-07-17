import express from 'express';
import cors from 'cors';
import 'dotenv/config';

// Import DB config to initialize the connection
import './config/db.js';

// Import routes
import departmentRoutes from './routes/departmentRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

// Import middlewares
import errorHandler from './middlewares/errorHandler.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

// Serve static frontend UI
app.use(express.static('public'));

// REST API Routes
app.use('/departments', departmentRoutes);
app.use('/employees', employeeRoutes);
app.use('/dashboard', dashboardRoutes);

// Catch-all route (404 Not Found)
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
