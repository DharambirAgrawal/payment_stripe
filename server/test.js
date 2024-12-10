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
// Backend: Create Setup Intent (only save payment method)

// 1. Create Customer
const createCustomer = async (email, name) => {
  const customer = await stripe.customers.create({
    email: email,
    name: name
  });
  return customer;
};

// 2. Create Setup Intent (only save payment method)
const createSetupIntent = async (customerId) => {
  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ['card'],
  });
  return setupIntent;
};

// 3. Create Payment Intent with setup_future_usage (charge and save)
const createPaymentIntentAndSave = async (amount, currency, customerId) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: currency,
    customer: customerId,
    setup_future_usage: 'off_session', // This saves the payment method
    payment_method_types: ['card'],
  });
  return paymentIntent;
};

// 4. Create Payment Intent (charge only, no saving)
const createPaymentIntent = async (amount, currency) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: currency,
    payment_method_types: ['card'],
  });
  return paymentIntent;
};

// Confirm the payment on the client side after PaymentElement submission
const handleSubmit = async (elements, stripe) => {
  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: 'https://your-domain.com/payment-complete',
    },
  });

  if (error) {
    // Handle error
    console.error(error);
  }
};

// For setup intent confirmation (saving payment method only)
const handleSetupSubmit = async (elements, stripe) => {
  const { error } = await stripe.confirmSetup({
    elements,
    confirmParams: {
      return_url: 'https://your-domain.com/setup-complete',
    },
  });

  if (error) {
    // Handle error
    console.error(error);
  }
};


const createSetupIntent = async (customerId) => {
  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ['card'],
    // No amount specified because we're only saving the payment method
  });
  return setupIntent;
};

// Frontend: Handle the setup intent submission
const handleSetupSubmit = async (elements, stripe) => {
  const { error } = await stripe.confirmSetup({
    elements,
    confirmParams: {
      return_url: 'https://your-domain.com/setup-complete',
    },
  });

  if (error) {
    // Handle error
    console.error(error);
  }
};

// Example usage in your React component:
const SaveCardComponent = () => {
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    await handleSetupSubmit(elements, stripe);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit">Save Card</button>
    </form>
  );
};