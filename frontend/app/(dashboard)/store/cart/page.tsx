"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import StoreHeader from "../_components/StoreHeader";
import { CartItem } from "./_components/types";
import { sampleCartItems } from "./_components/cartData";
import CartItemList from "./_components/CartItemList";
import OrderSummary from "./_components/OrderSummary";
import EmptyState from "../_components/EmptyState";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>(sampleCartItems);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 4.99;
  const discount = promoApplied ? promoDiscount : 0;
  const tax = (subtotal - discount) * 0.08; // 8% tax
  const total = subtotal + shipping + tax - discount;

  // Update item quantity
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item from cart
  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Apply promo code
  const applyPromoCode = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (promoCode.toUpperCase() === "WELCOME20") {
        setPromoDiscount(subtotal * 0.2); // 20% off
        setPromoApplied(true);
      } else {
        setPromoDiscount(0);
        setPromoApplied(false);
      }
      setIsLoading(false);
    }, 800);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <EmptyState
          icon={<ShoppingBag className="h-16 w-16 text-gray-300" />}
          title="Your cart is empty"
          description="Looks like you haven't added any products to your cart yet."
          action={
            <Link href="/store">
              <Button className="mt-4">Continue Shopping</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items section */}
          <div className="lg:col-span-2">
            <CartItemList
              items={cartItems}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
              clearCart={() => setCartItems([])}
            />
          </div>

          {/* Order summary section */}
          <div className="lg:col-span-1">
            <OrderSummary
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              discount={discount}
              total={total}
              promoCode={promoCode}
              setPromoCode={setPromoCode}
              promoApplied={promoApplied}
              isLoading={isLoading}
              applyPromoCode={applyPromoCode}
              onCheckout={() => router.push("/dashboard/store/checkout")}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
