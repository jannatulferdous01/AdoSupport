import Image from "next/image";
import { CartItem } from "./checkoutData";

interface OrderSummaryItemProps {
  item: CartItem;
}

export default function OrderSummaryItem({ item }: OrderSummaryItemProps) {
  return (
    <div className="py-4 flex gap-3">
      <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
          {item.name}
        </h4>
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-gray-500">Qty {item.quantity}</span>
          <span className="font-medium">
            ${(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}