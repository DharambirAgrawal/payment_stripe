import asyncHandler from "express-async-handler"
import { stripe } from "../../app.js";
import { AppError } from "../errors/AppError.js";
import { validateEmail } from "../utils/utils.js";
import { prisma } from "../../app.js";


//create customer
export const createCustomer = asyncHandler(async (req, res) => {
    const { name, email, description, phone, address } = req.body

    if (!email || !name || !validateEmail(email)) {
        throw new AppError("Resource not Found", 400)
    }

    //checking if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email: email },
    });

    if (existingUser) {
        throw new AppError("User already exists", 400)
    }


    // Preparing the data object for Stripe
    const customerData = { name: name, email: email }; // Required fields

    // Adding optional fields if they are provided
    if (description) customerData.description = description;
    if (phone) customerData.phone = phone;
    if (address) customerData.address = address;

    // Create customer on Stripe
    const customer = await stripe.customers.create(customerData);

    await prisma.user.create({
        data: {
            name:name,
            email: email,
            stripeCustomerId: customer.id,
        },
    });

    res.status(200).json({ customer_id: customer.id })
})


// Create a payment intent
export const paymentIntent = asyncHandler(async (req, res) => {

    const { amount, currency, customer, payment,paymentMethodType, metaData , description } = req.body;

    // Validate the request
    if (!amount || amount <= 0) {
        throw new AppError("Amount cannot be less than 0", 400)
    }
    if(!currency || !customer || !paymentMethodType ){
        throw new AppError("Resource not found!", 400)
    }

    //checking if user exists
    const existingUser = await prisma.user.findUnique({
        where: { stripeCustomerId: customer },
    });

    if (!existingUser) {
        throw new AppError("User does not exist", 404)
    }

    const customerData = { amount: Math.round(amount * 100), currency: currency, payment_method_types:[paymentMethodType], customer: customer }; // Required fields

    // Adding optional fields if they are provided
    if (description) customerData.description = description;
    if (metaData) customerData.metadata = metaData;

    // Create a PaymentIntent with the specified amount
    const paymentIntent = await stripe.paymentIntents.create(customerData);

    console.log(paymentIntent)

    const data={
        userId: existingUser.id,
        paymentIntentId: paymentIntent.id,
        amount:amount,
        currency:currency,
        paymentMethodType: paymentMethodType.toUpperCase()
    }

    if (description) data.description = description;
    if (metaData) data.metadata = metaData;

    const saveIntent=await prisma.paymentIntent.create({
        data:data
    })

    if(!saveIntent){
        throw new AppError("Error saving to DB", 500)
    }
    res.status(200).json({
        intent_id: paymentIntent.id,
    });
});



// Cancel payment intent
export const canclePaymentIntent = asyncHandler(async (req, res) => {
    try {
        const { paymentId } = req.params;
        const canceledPayment = await stripe.paymentIntents.cancel(paymentId);
        res.json(canceledPayment);
    } catch (error) {
        console.error('Error canceling payment:', error);
        res.status(500).json({ error: 'Failed to cancel payment' });
    }
});




export const createCard = asyncHandler(async (req, res) => {
    const { token, customer_id } = req.body;

    // Attach the card token to the customer
    const card = await stripe.customers.createSource(customer_id, {
        source: token,
    });
    console.log(card)

    res.json({ card: card.id });
});



























// {
//     "customer_id":"cus_RJYacWHQstxAaE",
//     "card_Name":"D",
//     "card_ExpYear":"2026",
//     "card_ExpMonth":"12",
//     "card_Number":"4242424242424242",
//     "card_CVC":"123"
// }
// export const createCard=asyncHandler(async(req,res)=>{
//     try{


//         const {  customer_id,
//             card_Name,
//             card_ExpYear,
//             card_ExpMonth,
//             card_Number,
//         card_CVC} = req.body
//         const card_token=await stripe.tokens.create({
//         card:{
//             name:card_Name,
//             number:card_Name,
//             exp_year:card_ExpYear,
//             exp_month:card_ExpMonth,
//             cvc:card_CVC
//         }
//     })

//     const card=await stripe.customers.createSource(customer_id,{
//         source:`${card_token.id}`
//     })

//     res.json({card:card.id})
// }catch(err){
//     console.log(err)
//     res.status(500).send('err')
// }
// })



// {
//     "card_id":"card_1212",
//     "customer_id":"cus_Nes",
//     "amount":"3000" //30$
// }
// card: "card_1QR4irGGBE709rEn4Nbm70Bq"
export const createCharge = asyncHandler(async (req, res) => {
    try {


        const { } = req.body

        const createCharge = await stripe.charges.create({
            receipt_email: "tester@gmail.com",
            currency: "INR",
            card: 'card_1QR4irGGBE709rEn4Nbm70Bq',
            customer: "cus_RJYacWHQstxAaE",
            amount: "5000"
        })

        res.json({ createCharge })
    } catch (err) {
        console.log(err)
        res.status(500).send('err')
    }

})

export const test = asyncHandler(async (req, res) => {
    try {

        const response = await fetch("/healthy", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        console.log(response)
        res.json({ card: 'success' })
    } catch (err) {
        console.log(err)
        res.status(500).send('err')
    }

})





// Webhook handler for Stripe events
export const webHook = asyncHandler(async (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        // Handle different event types
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                // Handle successful payment
                console.log('Payment succeeded:', paymentIntent.id);
                // Add your business logic here (e.g., update order status, send confirmation email)
                break;

            case 'payment_intent.payment_failed':
                const failedPayment = event.data.object;
                console.log('Payment failed:', failedPayment.id);
                // Add your failure handling logic here
                break;

            // Add more event types as needed
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(400).json({ error: 'Webhook signature verification failed' });
    }
});

// Retrieve payment details
export const paymentDetails = asyncHandler(async (req, res) => {
    try {
        const { paymentId } = req.params;
        const payment = await stripe.paymentIntents.retrieve(paymentId);
        res.json(payment);
    } catch (error) {
        console.error('Error retrieving payment:', error);
        res.status(500).json({ error: 'Failed to retrieve payment details' });
    }
});

