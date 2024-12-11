import BillingAddressForm from "./BillingAddress"
import React, { useState } from 'react';
import CardInfo from "./CardInfo"
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { CheckCircle, AlertCircle, Lock, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const CheckoutForm = () => {
    
   
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<{ type: string; content: string }>({ type: '', content: '' });
    const handleSubmit = async (formData) => {
        'use server'
        const query1 = formData.get("fullName");
        const query3 = formData.get("addressLine1");
        const query2 = formData.get("addressLine2");
        const query4 = formData.get("zipCode");
        const query5 = formData.get("country");
        const query6 = formData.get("state");
        const query7 = formData.get("city");
        

        console.log(query1,query2,query3,query4,query5,query6,query7)

        if (!stripe || !elements) {
            setMessage({ type: 'error', content: 'An error occurred while processing your payment. Please try again.' });
            console.error('Stripe.js has not loaded yet.');
            return;
        }

        setIsLoading(true);
        setMessage({ type: '', content: '' });

        try {


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
        <div >
            <form className="flex flex-row gap-5" action={handleSubmit}>
                <BillingAddressForm />
                <CardInfo >
                    <CardFooter className="flex flex-col space-y-4">
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
                </CardInfo >
            </form>
        </div>
    )
}

export default CheckoutForm