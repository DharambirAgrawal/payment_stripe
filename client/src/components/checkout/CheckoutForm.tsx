import BillingAddressForm from "./BillingAddress"
import CardInfo from "./CardInfo"
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { CheckCircle, AlertCircle, Lock, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ErrorBoundary } from "react-error-boundary";
import { useActionState } from "react";
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "../ui/separator";

// --legacy-peer-deps

// type StateType = {
//     type: "error" | "success" | "";
//     content: string
// }




const CheckoutForm = () => {
    'use server'
    const stripe = useStripe();
    const elements = useElements();
    const handleCheckout = async (previousState:any, formData:any) => {
        console.log(Object.fromEntries(formData))
        console.log(previousState)

        // if(!name || !line1  || !zipCode || !country || !state || !city){

        // }
        await new Promise((resolve) => setTimeout(resolve, 5000));

        if (!stripe || !elements) {
            return { type: 'error', content: 'An error occurred while processing your payment. Please try again.' }

        }


        try {


        } catch (error) {
            return {
                type: 'error',
                content: 'An error occurred while processing your payment. Please try again.'
            }
            console.error('Payment error:', error);
        } finally {
            // setIsLoading(false);
        }
    };

    const [state, formAction, isPending] = useActionState(
        handleCheckout,
        { type: '', content: '' }
    );

    return (
        <div >
            <ErrorBoundary
                fallback={<p>There was an error while submitting the form</p>}
            >


                <form className="flex flex-row gap-5" action={formAction}>
                    <BillingAddressForm />
                    <div className="flex flex-col gap-4 items-center">
                        <h2 className=" text-lg font-semibold">Save Card</h2>
                        <div className="items-top flex space-x-2">
                            <Checkbox id="terms1" name="accept"/>
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="terms1"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Accept terms and conditions
                                </label>
                                <p className="text-sm text-muted-foreground">
                                    You agree to our Terms of Service and Privacy Policy.
                                </p>
                            </div>
                        </div>
                        <Separator />
                        <CardInfo >
                            <CardFooter className="flex flex-col space-y-4">
                                {state?.content && (
                                    <Alert variant={state.type === 'error' ? 'destructive' : 'default'}>
                                        {state.type === 'error' ?
                                            <AlertCircle className="h-4 w-4" /> :
                                            <CheckCircle className="h-4 w-4" />
                                        }
                                        <AlertTitle>
                                            {state.type === 'error' ? 'Error' : 'Success'}
                                        </AlertTitle>
                                        <AlertDescription>
                                            {state.content}
                                        </AlertDescription>
                                    </Alert>
                                )}
                                <Button
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                    disabled={!stripe || !elements || isPending}
                                >
                                    {isPending ? (
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
                    </div>

                </form>
            </ErrorBoundary>

        </div>
    )
}

export default CheckoutForm