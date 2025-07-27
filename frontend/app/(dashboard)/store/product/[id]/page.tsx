"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { getProductById } from "./_components/productData";
import FeaturedProducts from "../../_components/FeaturedProducts";
import ProductBreadcrumbs from "./_components/ProductBreadcrumbs";
import ProductImages from "./_components/ProductImages";
import ProductDetails from "./_components/ProductDetails";
import ProductTabs from "./_components/ProductTabs";

export default function ProductPage() {
  const params = useParams();
  const productId = params?.id as string;
  const product = getProductById(productId);
  const [cartCount, setCartCount] = useState(0);

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <ProductBreadcrumbs category={product.category} name={product.name} />

        {/* Product display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product images */}
          <ProductImages
            images={product.images}
            name={product.name}
            isNew={product.isNew}
            isBestseller={product.isBestseller}
            price={product.price}
            discountPrice={product.discountPrice}
          />

          {/* Product details */}
          <ProductDetails
            product={product}
            onCartUpdate={(quantity) => setCartCount((prev) => prev + quantity)}
          />
        </div>

        {/* Tabs for features and more details */}
        <ProductTabs
          features={product.features}
          benefits={product.benefits}
          productId={product.id}
          rating={product.rating}
          reviewCount={product.reviewCount}
        />

        {/* Related products */}
        <div className="mt-16">
          <FeaturedProducts
            filter="all"
            onAddToCart={() => setCartCount((prev) => prev + 1)}
            title="Related Products"
          />
        </div>
      </main>
    </div>
  );
}
