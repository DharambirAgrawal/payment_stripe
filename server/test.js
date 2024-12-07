// 200	OK	Everything worked as expected.
// 400	Bad Request	The request was unacceptable, often due to missing a required parameter.
// 401	Unauthorized	No valid API key provided.
// 402	Request Failed	The parameters were valid but the request failed.
// 403	Forbidden	The API key doesn’t have permissions to perform the request.
// 404	Not Found	The requested resource doesn’t exist.
// 409	Conflict	The request conflicts with another request (perhaps due to using the same idempotent key).
// 429	Too Many Requests	Too many requests hit the API too quickly. We recommend an exponential backoff of your requests.
// 500, 502, 503, 504	Server Errors	Something went wrong on Stripe’s end. (These are rare.)
//here are test


const paymentMethodId = 'pm_xxx'; // From the frontend response
await stripe.paymentMethods.attach(paymentMethodId, {
  customer: 'cus_12345', // Customer ID
});

await stripe.customers.update('cus_12345', {
  invoice_settings: {
    default_payment_method: paymentMethodId,
  },
});
const subscription = await stripe.subscriptions.create({
    customer: 'cus_12345', // Customer ID
    items: [{ price: 'price_abc123' }], // Replace with your price ID
    default_payment_method: 'pm_xxx', // The saved payment method
  });
  
  console.log('Subscription ID:', subscription.id);

  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 2000, // Amount in cents
    currency: 'usd',
    customer: 'cus_12345',
    payment_method: 'pm_xxx',
    off_session: true,
    confirm: true,
  });
  
  console.log('Payment Intent Status:', paymentIntent.status);

  

  {
    id: 'pi_12345',
    amount: 2000,
    currency: 'usd',
    status: 'succeeded',
    payment_method: 'pm_67890', // The saved payment method ID
    customer: 'cus_ABC123',    // The associated customer ID
    charges: {
      data: [
        {
          id: 'ch_12345',
          status: 'succeeded',
          payment_method_details: {
            card: {
              brand: 'visa',
              last4: '4242',
              exp_month: 12,
              exp_year: 2024,
            },
          },
        },
      ],
    },
    setup_future_usage: 'off_session',
  }

  {
    type: 'card_error',
    message: 'Your card was declined.',
    code: 'card_declined',
    decline_code: 'insufficient_funds',
  }
  