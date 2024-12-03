import express from "express";

import { paymentIntent,canclePaymentIntent,webHook,paymentDetails, test,createCard,createCharge } from "../controllers/paymentController.js";

import { createCustomer } from "../controllers/paymentController.js";
const PaymentRouter = express.Router();



export const paymentRouter =PaymentRouter
.post('/create-customer',createCustomer)
.post('/create-payment-intent',paymentIntent)
.post('/create-card',createCard)


.post('/test',createCharge)
.post('/webhook', express.raw({ type: 'application/json' }),webHook)
.get('/payment/:paymentId',paymentDetails)
.post('/cancel-payment/:paymentId',canclePaymentIntent)
