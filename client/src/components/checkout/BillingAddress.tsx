import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";



export default function BillingAddressForm() { 

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Billing Address</CardTitle>
        <CardDescription>
          Please enter your billing address information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <label className="text-sm font-medium">Full Name</label>
          <Input
            name="fullName"
            placeholder="John Doe"
          
            required
          />
         
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Address Line 1</label>
            <Input
              name="addressLine1"
              placeholder="123 Main St"
             
              required
            />
          
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Address Line 2</label>
            <Input
              name="addressLine2"
              placeholder="Apt 4B"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">City</label>
            <Input
              name="city"
              placeholder="Select City"
             
              required
            />
           
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">State</label>
            <select
             name="state"
              required
              >
                <option value=''>Select State</option>
                <option value="NY">New York</option>
                <option value="TX">Texas</option>
                <option value="CA">California</option>
            </select>
           
          </div>

         
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
            <label className="text-sm font-medium">Zip Code</label>
            <Input
              name="zipCode"
              placeholder="12345"
             
              required
            />
          
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Country</label>
            <select
             name="country"
              required
              >
                <option value=''>Select country</option>
                <option value="CA">Canada</option>
                <option value="US">United State</option>
                <option value="UK">United Kingdom</option>
                <option value="IND">India</option>

            </select>
            
           
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
