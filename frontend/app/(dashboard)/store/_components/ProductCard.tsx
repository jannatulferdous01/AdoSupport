"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Product } from "../_data/storeData";

interface ProductCardProps {
  product: Product;
  className?: string;
  onAddToCart?: () => void;
}

export default function ProductCard({
  product,
  className,
  onAddToCart = () => {},
}: ProductCardProps) {
  const {
    id,
    name,
    price,
    discountPrice,
    images,
    rating,
    reviewCount,
    category,
    isNew,
    isBestseller,
    inStock = true,
  } = product;

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    onAddToCart();
  };

  const discount = discountPrice
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  const getCategoryColor = (category: string) => {
    const categoryMap: Record<string, string> = {
      "Mindfulness & Meditation": "text-blue-600 bg-blue-50",
      "Journals & Workbooks": "text-purple-600 bg-purple-50",
      "Activities & Games": "text-amber-600 bg-amber-50",
      "Physical Wellbeing": "text-rose-600 bg-rose-50",
      "Sleep Improvement": "text-indigo-600 bg-indigo-50",
      "Self-Care Kits": "text-emerald-600 bg-emerald-50",
      "Parent Resources": "text-teal-600 bg-teal-50",
      "Anxiety Management": "text-red-600 bg-red-50",
      "Sensory Items": "text-orange-600 bg-orange-50",
      "Educational Materials": "text-cyan-600 bg-cyan-50",
      "Mindfulness Tools": "text-blue-600 bg-blue-50",
    };

    return categoryMap[category] || "text-gray-600 bg-gray-50";
  };

  return (
    <div
      className={cn(
        "group bg-white rounded-xl overflow-hidden flex flex-col h-full transition-all duration-300 border border-gray-100",
        isHovered ? "shadow-[0_5px_15px_rgba(0,0,0,0.05)]" : "shadow-sm",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Product Image with hover effect */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
          <Link href={`/store/product/${id}`}>
            <Image
              src={images[0]}
              alt={name}
              fill
              className={cn(
                "object-cover transition-transform duration-700",
                isHovered ? "scale-105" : "scale-100"
              )}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority
            />

            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent transition-opacity duration-300",
                isHovered ? "opacity-100" : "opacity-0"
              )}
            />
          </Link>

          {/* Product badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[calc(100%-50px)]">
            {isNew && (
              <Badge className="bg-blue-500 hover:bg-blue-600 rounded-full text-[10px] px-2.5 py-0.5 font-medium">
                NEW
              </Badge>
            )}
            {isBestseller && (
              <Badge className="bg-amber-500 hover:bg-amber-600 rounded-full text-[10px] px-2.5 py-0.5 font-medium">
                BESTSELLER
              </Badge>
            )}
            {discount > 0 && (
              <Badge className="bg-red-500 hover:bg-red-600 rounded-full text-[10px] px-2.5 py-0.5 font-medium">
                SAVE {discount}%
              </Badge>
            )}
          </div>

          {/* Wishlist button - always visible */}
          <button
            className={cn(
              "absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm transition-transform",
              isWishlisted ? "text-red-500" : "text-gray-700"
            )}
            onClick={handleWishlist}
            aria-label="Add to wishlist"
          >
            <Heart
              size={16}
              className={cn(isWishlisted ? "fill-red-500" : "")}
            />
          </button>
        </div>

        {/* Add to cart overlay - always visible */}
        <div className="absolute -bottom-0.5 left-0 right-0 px-3 pb-3">
          <Button
            variant="default"
            size="sm"
            className="w-full gap-1.5 rounded-lg font-medium bg-primary/90 hover:bg-primary transition-colors"
            disabled={!inStock}
            onClick={handleAddToCart}
          >
            <ShoppingCart size={14} />
            {inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 pt-10 flex-1 flex flex-col">
        <Link href={`/store/product/${id}`} className="block">
          {/* Category */}
          <div className="mb-2">
            <span
              className={cn(
                "inline-block px-2 py-0.5 text-xs font-medium rounded-md",
                getCategoryColor(category)
              )}
            >
              {category}
            </span>
          </div>

          {/* Product name */}
          <h3 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2 group-hover:text-primary transition-colors mb-1.5">
            {name}
          </h3>

          {/* Product Rating */}
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={cn(
                    i < Math.floor(rating)
                      ? "fill-amber-400 text-amber-400"
                      : i < rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-200",
                    "mr-0.5"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-1.5 font-medium">
              {rating?.toFixed(1)} ({reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline mt-auto">
            {discountPrice ? (
              <>
                <span className="text-base sm:text-lg font-semibold text-gray-900">
                  ${discountPrice.toFixed(2)}
                </span>
                <span className="ml-2 text-xs sm:text-sm text-gray-500 line-through">
                  ${price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-base sm:text-lg font-semibold text-gray-900">
                ${price.toFixed(2)}
              </span>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}
