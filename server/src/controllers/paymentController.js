import asyncHandler from "express-async-handler"
import { stripe } from "../../app.js";


// {
//     "email":"xyz@gmail.com",
//     "name":"Don"
// }
export const createCustomer = asyncHandler(async (req, res) => {
    // {
    //     id: "cus_RJYacWHQstxAaE",
    //     "object": "customer",
    //     "address": null,
    //         "balance": 0,
    //         "created": 1732991584,
    //         "currency": null,
    //         "default_source": null, 
    //         "delinquent": false, 
    //         "description": null, 
    //         "discount": null, 
    //     "email": "xyz@gmail.com", 
    //     "invoice_prefix": 
    //     "DC225495", 
    //     "invoice_settings": { 
    //         "custom_fields": null, 
    //         "default_payment_method": null, "footer": null, "rendering_options": null }, "livemode": false, "metadata": { }, "name": "Don", "next_invoice_sequence": 1, "phone": null, "preferred_locales": [], "shipping": null, "tax_exempt": "none", "test_clock": null
    // }

    const { name, email } = req.body
    const customer = await stripe.customers.create({
        name: name,
        email: email
    })

    res.json(customer)

})


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
export const createCard = asyncHandler(async (req, res) => {
    try {
        console.log('kkkkkkkkkkkkkkkkkk')
      const { token, customer_id } = req.body;
  
      // Attach the card token to the customer
      const card = await stripe.customers.createSource(customer_id, {
        source: token,
      });
      console.log(card)
  
      res.json({ card: card.id });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error creating card');
    }
  });


// {
//     "card_id":"card_1212",
//     "customer_id":"cus_Nes",
//     "amount":"3000" //30$
// }
// card: "card_1QR4irGGBE709rEn4Nbm70Bq"
export const createCharge = asyncHandler(async (req, res) => {
    try{

        
        const {} = req.body
        
    const createCharge=await stripe.charges.create({
        receipt_email:"tester@gmail.com",
        currency:"INR",
        card:'card_1QR4irGGBE709rEn4Nbm70Bq',
        customer:"cus_RJYacWHQstxAaE",
        amount:"5000"
    })
    
    res.json({createCharge})
}catch(err){
    console.log(err)
    res.status(500).send('err')
}

})

export const test = asyncHandler(async (req, res) => {
    try{

        const response=await fetch("/healthy",{
            method:"GET",
            headers:{
                "Content-Type":"application/json"
            }
        })
    console.log(response)
    res.json({card:'success'})
}catch(err){
    console.log(err)
    res.status(500).send('err')
}

})



// Create a payment intent
export const paymentIntent = asyncHandler(async (req, res) => {

    try {

        const { amount, currency = 'usd', description } = req.body;

        // Validate the request
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        // Create a PaymentIntent with the specified amount
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency,
            description,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        console.log(paymentIntent)

        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: 'Failed to create payment intent' });
    }
});

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
