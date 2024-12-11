import {  PaymentElement } from '@stripe/react-stripe-js';
import { Card, CardHeader, CardTitle, CardDescription, CardContent} from "@/components/ui/card";
import {   CreditCard, Lock } from "lucide-react";
const CardInfo: React.FC<{children: React.ReactNode}> = ({children}) => {




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
            <div>

          <CardContent className="space-y-6">

            {/* Card Information Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium">Card Information</h3>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="rounded-lg border p-4 bg-white">
                
                <PaymentElement />
              </div>
            </div>

          
          {children}
          </CardContent>
            </div>
      </Card>
    </div>
  );
};

export default CardInfo;