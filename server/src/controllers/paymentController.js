import asyncHandler from "express-async-handler"
import { stripe } from "../../app.js";
import { AppError } from "../errors/AppError.js";
import { validateEmail } from "../utils/utils.js";
import { prisma } from "../../app.js";
import { INVOICE_EMAIL_MESSAGE, INVOICE_TEMPLATE } from "../messages/emailMessages.js";
import { sendEmail } from "../services/emailService.js";
// import { cancelIntent } from "../middleware/stripePaymentMiddleware.js";
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

    const { amount, currency, customer,paymentMethodType, metadata , description } = req.body;

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

    const customerData = { amount: Math.round(amount * 100), currency: currency, payment_method_types:[paymentMethodType], customer: customer,  setup_future_usage: 'off_session' }; // Required fields

    // Adding optional fields if they are provided
    if (description) customerData.description = description;
    if (metadata) customerData.metadata = metadata;


    // Create a PaymentIntent with the specified amount
    const paymentIntent = await stripe.paymentIntents.create(customerData);

    // console.log(paymentIntent)

    const data={
        userId: existingUser.id,
        paymentIntentId: paymentIntent.id,
        amount:amount,
        currency:currency,
        paymentMethodType: paymentMethodType.toUpperCase(),
    }

    if (description) data.description = description;
    if (metadata) data.metadata = metadata;

    const saveIntent=await prisma.paymentIntent.create({
        data:data
    })

    //saving to schedule job
    const runAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    await prisma.scheduledJob.create({
        data: {
            paymentIntentId: paymentIntent.id,
            runAt,
        },
    });

    if(!saveIntent){
        throw new AppError("Error saving to DB", 500)
    }
    res.status(200).json({
        intent_id: paymentIntent.id,
    });
    // console.log('working..')
//canceling the intent after 2 min
// cancelIntent()
// console.log('end..')

});



// Cancel payment intent (needed to complete)
export const canclePaymentIntent = asyncHandler(async (req, res) => {

    const authHeader = req.headers['authorization'];
    const intent_id = authHeader && authHeader.split(' ')[1];

    const existingIntent = await prisma.paymentIntent.findUnique({
        where: { paymentIntentId: intent_id },
    });

    if (!existingIntent) {
        throw new AppError("The intent not found", 404)
    }
   
    const canceledPayment = await stripe.paymentIntents.cancel(intent_id);

    await prisma.paymentIntent.update({
        where: { paymentIntentId: intent_id },
        data:{
            status:"CANCELED"
        }
    })
    console.log(canceledPayment)
    res.json(canceledPayment);
   
});




export const createCard = asyncHandler(async (req, res) => {
    const { line1, city, state, postalCode, country, line2 } = req.body;

    const authHeader = req.headers['authorization'];
    const customerId = authHeader && authHeader.split(' ')[1];
    const cardToken = authHeader && authHeader.split(' ')[2];

    if(!cardToken || !customerId){
        throw new AppError("Tokens not provided", 500)
    }

    if(!line1 || !city || !state || !postalCode || !country ){
        throw new AppError("Address not provided", 400)
    }

    const existingUser = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId },
    });

    if(!existingUser){
        throw new AppError("User not found", 404)
    }
    
    // Attach the card token to the customer
    const card = await stripe.customers.createSource(customerId, {
        source: cardToken,
    });
    console.log(card)

    const saveCard=await prisma.paymentMethod.create({
        data:{
            paymentMethodId:card.id,
            type:"CARD",
            brand:card.brand,
            last4:card.last4,
            expiryMonth:card.exp_month,
            expiryYear:card.exp_year,
            status:"ACTIVE",
            isDefault:true,
            billingAddress:{
                create:{
                    line1, city, state, postalCode, country, line2
                }
            }
        },

    })

    res.json({ card: card.id });
});










export const sendInvoice = asyncHandler(async (req, res) => {

  

    await sendEmail(
        "dev.dharambir@gmail.com",
        INVOICE_EMAIL_MESSAGE(),
        [
            {
            //   filename: `Invoice-${invoiceData.invoiceNumber}.pdf`,
              filename: `Invoice-123.pdf`,
              content: await INVOICE_TEMPLATE(),
              contentType: 'application/pdf'
            }
          ]
    )

    res.json({ type: "success" });
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

