// src/server.js
import dotenv from "dotenv";
import cors from 'cors'
dotenv.config();
import express from "express";
import { errorHandler, AppError } from './src/errors/index.js';
import { logger } from "./src/utils/logger.js";

// Load environment variables

const app = express();

// const corsOptions = { 
//   // origin:'https://abc.onrender.com',
//   AccessControlAllowOrigin: '*',  
//   origin: '*',  
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' 
// }
app.use(cors());

app.use("/home",express.static('public'))

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger)

//schedule job

// import {startCrons,stopCrons} from './src/middleware/stripePaymentMiddleware.js'
// // Start the cron jobs
// startCrons();

//stripe initialize
import Stripe from 'stripe';
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//prisma initialize
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();


//routes
import { paymentRouter } from "./src/routes/paymentRouter.js";

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Server is healthy' });
  });
app.use("/api/payments/stripe", paymentRouter);



//Handling succcess page
app.use("/api/success",(req,res)=>{
  res.status(200).json({
    status:"success"
  });
})

// Handle 404 routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware (should be last)
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on: http://localhost:${PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  stopCrons();
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing application...');
  stopCrons();
  process.exit(0);
});

export default app;