"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import CustomForm from "@/components/form/CustomForm";
import OrderSummary from "./_components/OrderSummary";
import { sampleCartItems } from "./_components/checkoutData";
import { checkoutSchema } from "./_components/checkoutSchema";
import CheckoutFormContent from "./_components/CheckoutFormContent";
import { FieldValues } from "react-hook-form";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems] = useState(sampleCartItems);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 4.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  // Handle form submission
  const handleSubmit = async (data: FieldValues) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Order submitted:", data);
      toast.success("Order placed successfully! Thank you for your purchase.");
      setIsLoading(false);
      router.push("/store/confirmation");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center mb-8">
          <Link
            href="/dashboard/store/cart"
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to cart</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 ml-4">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout form */}
          <div className="lg:col-span-2">
            <CustomForm
              onSubmit={handleSubmit}
              defaultValues={{
                email: "",
                firstName: "",
                lastName: "",
                address: "",
                city: "",
                state: "",
                zipCode: "",
                phone: "",
                paymentMethod: "credit",
                cardName: "",
                cardNumber: "",
                cardExpiry: "",
                cardCvv: "",
                saveInfo: false,
                createAccount: false,
              }}
              resolver={zodResolver(checkoutSchema)}
              className="space-y-8"
            >
              <CheckoutFormContent isLoading={isLoading} />
            </CustomForm>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
