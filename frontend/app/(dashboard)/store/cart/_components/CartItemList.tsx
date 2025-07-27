import Link from "next/link";
import { Button } from "@/components/ui/button";
import CartItem from "./CartItem";
import { CartItemListProps } from "./types";

export default function CartItemList({
  items,
  updateQuantity,
  removeItem,
  clearCart,
}: CartItemListProps) {
  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <Link href="/dashboard/store">
          <Button variant="outline" className="gap-2">
            Continue Shopping
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={clearCart}
        >
          Clear Cart
        </Button>
      </div>
    </>
  );
}
