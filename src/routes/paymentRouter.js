import express from "express";

import { payment } from "../controllers/paymentController.js";

const PaymentRouter = express.Router();



export const paymentRouter =PaymentRouter
.post('/pay',payment)

