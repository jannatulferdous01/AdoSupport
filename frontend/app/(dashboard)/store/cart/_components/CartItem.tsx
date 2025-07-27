import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CartItemProps } from "./types";

export default function CartItem({
  item,
  updateQuantity,
  removeItem,
}: CartItemProps) {
  return (
    <div className="p-6">
      <div className="flex gap-4 sm:gap-6">
        <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
            <div>
              <h3 className="text-base font-medium text-gray-900 truncate mb-1">
                <Link href={`/dashboard/store/product/${item.id}`}>
                  {item.name}
                </Link>
              </h3>
              <div className="flex items-center">
                {item.price !== item.originalPrice ? (
                  <>
                    <span className="text-sm font-medium text-gray-900">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      ${item.originalPrice.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-medium text-gray-900">
                    ${item.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center mt-2 sm:mt-0">
              <div className="flex items-center border rounded-md mr-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-none rounded-l-md"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus size={14} />
                </Button>
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.id, parseInt(e.target.value) || 1)
                  }
                  className="w-12 h-8 text-center border-0 focus-visible:ring-0"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-none rounded-r-md"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus size={14} />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-red-500"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 size={16} />
                <span className="sr-only">Remove item</span>
              </Button>
            </div>
          </div>

          <div className="mt-2 flex items-center text-sm text-emerald-600">
            <Check size={16} className="mr-1" />
            In stock, ready to ship
          </div>
        </div>
      </div>
    </div>
  );
}
