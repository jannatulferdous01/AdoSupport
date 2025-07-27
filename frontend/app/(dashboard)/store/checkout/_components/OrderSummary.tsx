import Image from "next/image";
import { Info, Truck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "./checkoutData";
import OrderSummaryItem from "./OrderSummaryItem";

interface OrderSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export default function OrderSummary({
  cartItems,
  subtotal,
  shipping,
  tax,
  total,
}: OrderSummaryProps) {
  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 sticky top-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

      <div className="divide-y divide-gray-200">
        {cartItems.map((item) => (
          <OrderSummaryItem key={item.id} item={item} />
        ))}
      </div>

      <div className="mt-4 space-y-3 text-sm">
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

      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 text-sm text-emerald-800">
          <Truck size={18} className="text-emerald-500" />
          <p>
            <span className="font-medium">Free shipping</span> on orders over
            $50
          </p>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 text-sm text-blue-800">
          <Info size={18} className="text-blue-500" />
          <p>
            Your purchase contributes to our adolescent mental health research
            fund.
          </p>
        </div>
      </div>
    </div>
  );
}
