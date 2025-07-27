import { useState } from "react";
import {
  Star,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ProductDetailsProps {
  product: any; // Using 'any' for simplicity, but you should define a proper type
  onCartUpdate: (quantity: number) => void;
}

export default function ProductDetails({
  product,
  onCartUpdate,
}: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= product.stockCount) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    onCartUpdate(quantity);
    // Implement add to cart functionality
    console.log(`Added ${quantity} of ${product.id} to cart`);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {product.name}
        </h1>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={18}
                className={cn(
                  "mr-0.5",
                  i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300"
                )}
              />
            ))}
            <span className="ml-2 text-sm text-gray-500">
              ({product.reviewCount} reviews)
            </span>
          </div>
        </div>

        <div className="flex items-center mb-6">
          {product.discountPrice ? (
            <>
              <span className="text-3xl font-bold text-gray-900">
                ${product.discountPrice.toFixed(2)}
              </span>
              <span className="ml-3 text-lg text-gray-500 line-through">
                ${product.price.toFixed(2)}
              </span>
              <Badge className="ml-3 bg-red-500 hover:bg-red-600">
                Save $
                {(product.price - (product.discountPrice || 0)).toFixed(2)}
              </Badge>
            </>
          ) : (
            <span className="text-3xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        <div className="prose prose-sm max-w-none text-gray-600 mb-6">
          <p>{product.description}</p>
        </div>

        <Separator className="my-6" />

        {/* Product actions */}
        <div className="space-y-6">
          <div className="flex items-center">
            <span className="mr-3 text-sm font-medium text-gray-700">
              Quantity:
            </span>
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none rounded-l-md"
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </Button>
              <Input
                type="number"
                min={1}
                max={product.stockCount}
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 h-10 text-center border-0 focus-visible:ring-0"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none rounded-r-md"
                onClick={() =>
                  quantity < product.stockCount && setQuantity(quantity + 1)
                }
                disabled={quantity >= product.stockCount}
              >
                <Plus size={16} />
              </Button>
            </div>
            <span className="ml-4 text-sm text-gray-500">
              {product.stockCount} available
            </span>
          </div>

          <div className="flex gap-4">
            <Button
              className="flex-1 gap-2"
              size="lg"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart size={18} />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="lg"
              className={cn(
                "gap-2",
                isWishlisted && "bg-red-50 border-red-200 text-red-600"
              )}
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              <Heart
                size={18}
                className={cn(isWishlisted && "fill-red-500 text-red-500")}
              />
              {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
            </Button>
          </div>
        </div>

        {/* Product promises */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
            <Truck size={20} className="text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Free Shipping</p>
              <p className="text-xs text-gray-500">Orders over $50</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
            <Shield size={20} className="text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Secure Payment
              </p>
              <p className="text-xs text-gray-500">100% Protected</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
            <RotateCcw size={20} className="text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                30-Day Returns
              </p>
              <p className="text-xs text-gray-500">Money back guarantee</p>
            </div>
          </div>
        </div>

        {/* Product details */}
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-900">Product Details</h3>
          <dl className="mt-2 border-t border-gray-200">
            <div className="py-3 flex justify-between border-b border-gray-200">
              <dt className="text-sm text-gray-500">Brand</dt>
              <dd className="text-sm font-medium text-gray-900">
                {product.brand}
              </dd>
            </div>
            <div className="py-3 flex justify-between border-b border-gray-200">
              <dt className="text-sm text-gray-500">Age Range</dt>
              <dd className="text-sm font-medium text-gray-900">
                {product.age}
              </dd>
            </div>
            <div className="py-3 flex justify-between border-b border-gray-200">
              <dt className="text-sm text-gray-500">Materials</dt>
              <dd className="text-sm font-medium text-gray-900">
                {product.materials}
              </dd>
            </div>
            <div className="py-3 flex justify-between border-b border-gray-200">
              <dt className="text-sm text-gray-500">Dimensions</dt>
              <dd className="text-sm font-medium text-gray-900">
                {product.dimensions}
              </dd>
            </div>
            <div className="py-3 flex justify-between">
              <dt className="text-sm text-gray-500">Weight</dt>
              <dd className="text-sm font-medium text-gray-900">
                {product.weight}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
