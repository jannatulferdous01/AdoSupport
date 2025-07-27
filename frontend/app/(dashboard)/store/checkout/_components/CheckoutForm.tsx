import { UseFormReturn } from "react-hook-form";
import { CheckoutFormData } from "./checkoutSchema";
import ContactInformation from "./ContactInformation";
import ShippingInformation from "./ShippingInformation";
import PaymentMethod from "./PaymentMethod";

interface CheckoutFormProps {
  form: UseFormReturn<CheckoutFormData>;
}

export default function CheckoutForm({ form }: CheckoutFormProps) {
  return (
    <>
      {/* <ContactInformation form={form} />
      <ShippingInformation form={form} />
      <PaymentMethod form={form} /> */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Order Summary</h2>
      </div>
    </>
  );
}
