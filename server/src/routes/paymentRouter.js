import express from "express";

import { paymentIntent,canclePaymentIntent,webHook,paymentDetails, test,createCard,createCharge } from "../controllers/paymentController.js";

const PaymentRouter = express.Router();



export const paymentRouter =PaymentRouter
.post('/test',createCharge)
.post('/create-payment-intent',paymentIntent)
.post('/webhook', express.raw({ type: 'application/json' }),webHook)
.get('/payment/:paymentId',paymentDetails)
.post('/cancel-payment/:paymentId',canclePaymentIntent)
.post('/create-card',createCard)
