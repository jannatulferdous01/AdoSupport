import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContactInformation from "./ContactInformation";
import PaymentMethod from "./PaymentMethod";
import ShippingInformation from "./ShippingInformation";

interface CheckoutFormContentProps {
  isLoading: boolean;
}

export default function CheckoutFormContent({
  isLoading,
}: CheckoutFormContentProps) {
  return (
    <>
      {/* These components no longer need form prop since we're using 
          react-hook-form's FormProvider context from CustomForm */}
      <ContactInformation />
      <ShippingInformation />
      <PaymentMethod />

      <div className="flex justify-between items-center pt-4">
        <Link href="/dashboard/store/cart">
          <Button variant="outline" className="gap-2" type="button">
            <ArrowLeft size={16} /> Back to Cart
          </Button>
        </Link>
        <Button type="submit" size="lg" disabled={isLoading}>
          {isLoading ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </>
  );
}
