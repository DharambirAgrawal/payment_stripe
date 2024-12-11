import { useState, ChangeEvent } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel
} from "@/components/ui/select";

interface FormData {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Errors {
  fullName?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export default function BillingAddressForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [errors, setErrors] = useState<Errors>({});

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (formData.fullName.length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters.";
    }

    if (formData.addressLine1.length < 5) {
      newErrors.addressLine1 = "Address must be at least 5 characters.";
    }

    if (formData.city.length < 2) {
      newErrors.city = "City must be at least 2 characters.";
    }

    if (formData.state.length < 2) {
      newErrors.state = "Please select a state.";
    }

    if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = "Invalid zip code format.";
    }

    if (formData.country.length < 2) {
      newErrors.country = "Please select a country.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    console.log(formData)
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: keyof FormData, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
          {errors.fullName && (
            <p className="text-sm text-red-500">{errors.fullName}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Address Line 1</label>
            <Input
              name="addressLine1"
              placeholder="123 Main St"
              value={formData.addressLine1}
              onChange={handleInputChange}
              required
            />
            {errors.addressLine1 && (
              <p className="text-sm text-red-500">{errors.addressLine1}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Address Line 2</label>
            <Input
              name="addressLine2"
              placeholder="Apt 4B"
              value={formData.addressLine2}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">City</label>
            <Input
              name="city"
              placeholder="Select City"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
            {errors.city && (
              <p className="text-sm text-red-500">{errors.city}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">State</label>
            <Select
              name="state"
              value={formData.state}
              onValueChange={(value) => handleSelectChange("state", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <option value="">None</option>
              {/* <SelectItem value="undefined">Select state</SelectItem> */}
                <SelectItem value="NY">New York</SelectItem>
                <SelectItem value="CA">California</SelectItem>
                <SelectItem value="TX">Texas</SelectItem>
              </SelectContent>
            </Select>
            {errors.state && (
              <p className="text-sm text-red-500">{errors.state}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Zip Code</label>
            <Input
              name="zipCode"
              placeholder="12345"
              value={formData.zipCode}
              onChange={handleInputChange}
              required
            />
            {errors.zipCode && (
              <p className="text-sm text-red-500">{errors.zipCode}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Country</label>
            <select
            //  name="country"
              id="cars" required>
                <option value=''>Select country</option>
                <option value="volvo">Volvo</option>
                <option value="saab">Saab</option>
                <option value="mercedes">Mercedes</option>
                <option value="audi">Audi</option>
            </select>
            <Select
              name="country"
              value={formData.country}
              onValueChange={(value) => handleSelectChange("country", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country"/>
              </SelectTrigger>
              <SelectContent>
              
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="UK">United Kingdom</SelectItem>
                <SelectItem value="US">United States</SelectItem>
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-sm text-red-500">{errors.country}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
