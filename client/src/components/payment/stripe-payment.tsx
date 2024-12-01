
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { StripeCardElement } from '@stripe/stripe-js';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error('Stripe.js has not loaded yet.');
      return;
    }
    setIsLoading(true);
    setMessage({ type: '', content: '' });

    const cardElement = elements.getElement(CardElement) as StripeCardElement;

    if (!cardElement) {
      console.error('CardElement not found.');
      return;
    }

    // Create a token using Stripe.js
    const { error, token } = await stripe.createToken(cardElement);

    if (error) {
      setMessage({ type: 'error', content: error.message });
      console.error('Stripe tokenization error:', error.message);
      return;
    }

    if (!token) {
      console.error('Token generation failed.');
      setMessage({ type: 'error', content: error.message });
      return;
    }

    // Send the token to your backend
    try {
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Payment Details</CardTitle>
        <CardDescription>Enter your card information to complete the purchase</CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                    padding: '16px',
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
              className="min-h-[40px]"
            />
          </div>

          {message.content && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="mt-4">
              {message.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
              <AlertDescription>
                {message.content}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={!stripe || !elements || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Pay Now'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
  // return (
  //   <form onSubmit={handleSubmit}>
  //     <CardElement
  //       options={{
  //         style: {
  //           base: {
  //             fontSize: '16px',
  //             color: '#424770',
  //             '::placeholder': {
  //               color: '#aab7c4',
  //             },
  //           },
  //           invalid: {
  //             color: '#9e2146',
  //           },
  //         },
  //       }}
  //     />
  //     <button type="submit" disabled={!stripe || !elements}>
  //       Submit Payment
  //     </button>
  //   </form>
  // );
};

export default CheckoutForm;
