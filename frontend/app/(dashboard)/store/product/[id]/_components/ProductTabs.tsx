import { CheckCircle, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductReviews from "./ProductReviews";

interface ProductTabsProps {
  features: string[];
  benefits: string[];
  productId: string;
  rating: number;
  reviewCount: number;
}

export default function ProductTabs({
  features,
  benefits,
  productId,
  rating,
  reviewCount,
}: ProductTabsProps) {
  return (
    <div className="mt-16">
      <Tabs defaultValue="features">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger
            value="features"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-6"
          >
            Features
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-6"
          >
            Reviews
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="features"
          className="text-gray-700 leading-relaxed pt-6"
        >
          <div className="max-w-3xl space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle
                  size={20}
                  className="text-primary mr-3 mt-0.5 flex-shrink-0"
                />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{feature}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="pt-6">
          <ProductReviews
            productId={productId}
            rating={rating}
            reviewCount={reviewCount}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
