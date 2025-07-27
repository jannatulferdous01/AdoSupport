import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductImagesProps {
  images: string[];
  name: string;
  isNew: boolean;
  isBestseller: boolean;
  price: number;
  discountPrice: number | null;
}

export default function ProductImages({
  images,
  name,
  isNew,
  isBestseller,
  price,
  discountPrice,
}: ProductImagesProps) {
  const [mainImage, setMainImage] = useState(images[0]);

  const discount = discountPrice
    ? Math.round(((price - (discountPrice || 0)) / price) * 100)
    : 0;

  return (
    <div className="space-y-4">
      <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-100">
        <Image
          src={mainImage}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {isNew && (
          <Badge className="absolute top-4 left-4 bg-blue-500 hover:bg-blue-600">
            New
          </Badge>
        )}
        {isBestseller && (
          <Badge className="absolute top-4 left-4 bg-amber-500 hover:bg-amber-600">
            Bestseller
          </Badge>
        )}
        {discount > 0 && (
          <Badge className="absolute top-4 right-4 bg-red-500 hover:bg-red-600">
            -{discount}% OFF
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            className={cn(
              "aspect-square relative rounded-md overflow-hidden border",
              mainImage === image
                ? "border-primary ring-2 ring-primary/20"
                : "border-gray-200 hover:border-gray-300"
            )}
            onClick={() => setMainImage(image)}
          >
            <Image
              src={image}
              alt={`${name} view ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
