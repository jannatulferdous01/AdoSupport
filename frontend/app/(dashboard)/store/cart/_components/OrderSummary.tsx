import Link from "next/link";
import { ArrowRight, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { OrderSummaryProps } from "./types";

export default function OrderSummary({
  subtotal,
  shipping,
  tax,
  discount,
  total,
  promoCode,
  setPromoCode,
  promoApplied,
  isLoading,
  applyPromoCode,
  onCheckout,
}: OrderSummaryProps) {
  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          {shipping === 0 ? (
            <span className="text-emerald-600 font-medium">Free</span>
          ) : (
            <span className="font-medium">${shipping.toFixed(2)}</span>
          )}
        </div>
        {promoApplied && (
          <div className="flex justify-between text-emerald-600">
            <span>Discount (WELCOME20)</span>
            <span className="font-medium">-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (8%)</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
        <Separator className="my-3" />
        <div className="flex justify-between text-base font-medium">
          <span className="text-gray-900">Total</span>
          <span className="text-gray-900">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Promo code section */}
      <div className="mt-6">
        <div className="flex gap-2">
          <Input
            placeholder="Promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="bg-white"
          />
          <Button
            variant="outline"
            onClick={applyPromoCode}
            disabled={!promoCode || isLoading}
            className={cn(
              promoApplied && "border-emerald-500 text-emerald-600"
            )}
          >
            {promoApplied ? "Applied" : isLoading ? "Applying..." : "Apply"}
          </Button>
        </div>
        {promoApplied && (
          <p className="mt-2 text-xs text-emerald-600 flex items-center">
            <Check size={12} className="mr-1" />
            20% discount applied successfully!
          </p>
        )}
      </div>

      <Button className="w-full mt-6" size="lg" onClick={onCheckout}>
        Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
      </Button>

      <ShippingAndReturnsInfo />

      <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100 text-sm flex">
        <AlertCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
        <p className="text-blue-700">
          Your purchase supports adolescent mental health research. Learn more
          about our{" "}
          <Link
            href="/impact"
            className="underline font-medium hover:text-blue-800"
          >
            impact initiatives
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function ShippingAndReturnsInfo() {
  return (
    <div className="mt-6">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="shipping" className="border-b-0">
          <AccordionTrigger className="py-2 text-sm hover:no-underline">
            <span className="font-medium">Shipping Information</span>
          </AccordionTrigger>
          <AccordionContent className="text-xs text-gray-600">
            <p className="mb-2">
              Free shipping on all orders over $50. Standard shipping takes 3-5
              business days.
            </p>
            <p>Express shipping available at checkout for an additional fee.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="returns" className="border-b-0">
          <AccordionTrigger className="py-2 text-sm hover:no-underline">
            <span className="font-medium">Returns & Exchanges</span>
          </AccordionTrigger>
          <AccordionContent className="text-xs text-gray-600">
            <p className="mb-2">
              We offer a 30-day return policy for unused items in original
              packaging.
            </p>
            <p>
              Contact our customer service team to initiate a return or
              exchange.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
