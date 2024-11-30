import express from "express";

import { paymentIntent,canclePaymentIntent,webHook,paymentDetails, test } from "../controllers/paymentController.js";

const PaymentRouter = express.Router();



export const paymentRouter =PaymentRouter
.post('/test',test)
.post('/create-payment-intent',paymentIntent)
.post('/webhook', express.raw({ type: 'application/json' }),webHook)
.get('/payment/:paymentId',paymentDetails)
.post('/cancel-payment/:paymentId',canclePaymentIntent)

