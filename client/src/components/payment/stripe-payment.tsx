import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { StripeCardElement } from '@stripe/stripe-js';


const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error('Stripe.js has not loaded yet.');
      return;
    }

    const cardElement = elements.getElement(CardElement) as StripeCardElement;

    if (!cardElement) {
      console.error('CardElement not found.');
      return;
    }

    // Create a token using Stripe.js
    const { error, token } = await stripe.createToken(cardElement);

    if (error) {
      console.error('Stripe tokenization error:', error.message);
      return;
    }

    if (!token) {
      console.error('Token generation failed.');
      return;
    }

    // Send the token to your backend
    try {
    //   const response = await axios.post('https://urban-bassoon-vjwqprg79gv3wpqp-3000.app.github.dev/api/payments/stripe/create-card', {
    //     token: token.id, // Token ID returned by Stripe
    //     customer_id: 'your-customer-id', // Replace with actual customer ID
    //   });
    //   const response = await axios.post('http://localhost:3000/api/payments/stripe/create-card', {
    //     token: token.id, // Token ID returned by Stripe
    //     customer_id: 'your-customer-id', // Replace with actual customer ID
    //   });
    const data={
        token: token.id, 
      customer_id: 'cus_RJYacWHQstxAaE',
    }
      const response = await fetch('https://urban-bassoon-vjwqprg79gv3wpqp-3000.app.github.dev/api/payments/stripe/create-card', {
        method: 'POST', 
        // mode: 'no-cors', 
        body: JSON.stringify(data), 
        headers: {
            "Content-Type": "application/json",
          },
     });
     const a= await response.json()
     console.log(a)
      console.log(response)

    //   console.log('Card successfully created:', response.data);
    } catch (backendError) {
      console.error('Error communicating with backend:', backendError);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      <button type="submit" disabled={!stripe || !elements}>
        Submit Payment
      </button>
    </form>
  );
};

export default CheckoutForm;
