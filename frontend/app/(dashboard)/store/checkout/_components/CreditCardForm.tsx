import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CheckoutFormData } from "./checkoutSchema";

interface CreditCardFormProps {
  form: UseFormReturn<CheckoutFormData>;
}

export default function CreditCardForm({ form }: CreditCardFormProps) {
  return (
    <div className="mt-4 space-y-4">
      <FormField
        control={form.control}
        name="cardName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name on Card</FormLabel>
            <FormControl>
              <Input placeholder="John Doe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="cardNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Card Number</FormLabel>
            <FormControl>
              <Input placeholder="XXXX XXXX XXXX XXXX" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="cardExpiry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiration Date</FormLabel>
              <FormControl>
                <Input placeholder="MM/YY" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cardCvv"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CVV</FormLabel>
              <FormControl>
                <Input placeholder="123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}