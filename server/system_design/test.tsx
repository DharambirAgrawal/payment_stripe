import { CardElement, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { StripeCardElement } from '@stripe/stripe-js';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle, CreditCard, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface PaymentFormData {
  name: string;
  email: string;
}

interface PaymentResponse {
  success: boolean;
  message: string;
}

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: string; content: string }>({ type: '', content: '' });
  const [formData, setFormData] = useState<PaymentFormData>({
    name: '',
    email: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error('Stripe.js has not loaded yet.');
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', content: '' });

    try {
      // const { error, token } = await stripe.createToken(cardElement);
      const a = await stripe.confirmPayment({
        elements, // From useElements hook
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: 'John Doe',
              email: 'customer@example.com',
            },
          },
        setup_future_usage: 'off_session', // Save for future automatic charges
        },
      });
      console.log(a)
      if (error) {
        setMessage({ type: 'error', content: error.message+"" });
        console.error('Error saving card:', error.message);
        return;
      }


      // if (!token) {
      //   throw new Error('Token generation failed.');
      // }

      const data = {
        token: token.id,
        customer_id: 'cus_RJYacWHQstxAaE',
        name: formData.name,
        email: formData.email
      };

      const response = await fetch('https://urban-bassoon-vjwqprg79gv3wpqp-3000.app.github.dev/api/payments/stripe/create-card', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      // console.log(response)
      const result: PaymentResponse = await response.json();
      console.log(result)
      
      if (!response.ok) {
          setMessage({ type: 'error', content: result.message || 'Payment failed. Please try again.' });
        } else {
          setMessage({ type: 'success', content: 'Payment processed successfully!' });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        content: 'An error occurred while processing your payment. Please try again.' 
      });
      console.error('Payment error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <CreditCard className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold">Secure Payment</CardTitle>
          </div>
          <CardDescription>
            Enter your payment information to complete your purchase
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="font-medium">Personal Information</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Card Information Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium">Card Information</h3>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="rounded-lg border p-4 bg-white">
                {/* <CardElement
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
                /> */}
                <PaymentElement />
              </div>
            </div>

            {message.content && (
              <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                {message.type === 'error' ? 
                  <AlertCircle className="h-4 w-4" /> : 
                  <CheckCircle className="h-4 w-4" />
                }
                <AlertTitle>
                  {message.type === 'error' ? 'Error' : 'Success'}
                </AlertTitle>
                <AlertDescription>
                  {message.content}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full"
              size="lg"
              disabled={!stripe || !elements || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Pay Securely Now
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Your payment information is encrypted and secure
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CheckoutForm;