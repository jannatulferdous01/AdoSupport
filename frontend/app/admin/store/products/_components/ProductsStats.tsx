"use client";

import { Package, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import StatsCard from "../../../users/_components/StatsCard";
import { ProductData } from "../_services/mockProductsApi";

interface ProductsStatsProps {
  products: ProductData[];
  loading: boolean;
}

export default function ProductsStats({ products, loading }: ProductsStatsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === "active").length;
  const outOfStock = products.filter(p => p.status === "out_of_stock").length;
  const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.sales), 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Products"
        value={totalProducts.toString()}
        icon={<Package className="h-5 w-5" />}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
        trend={8.2}
      />
      
      <StatsCard
        title="Active Products"
        value={activeProducts.toString()}
        icon={<TrendingUp className="h-5 w-5" />}
        iconBg="bg-green-100"
        iconColor="text-green-600"
        trend={12.5}
      />
      
      <StatsCard
        title="Revenue"
        value={`$${totalRevenue.toLocaleString()}`}
        icon={<DollarSign className="h-5 w-5" />}
        iconBg="bg-purple-100"
        iconColor="text-purple-600"
        trend={15.4}
      />
      
      <StatsCard
        title="Out of Stock"
        value={outOfStock.toString()}
        icon={<AlertTriangle className="h-5 w-5" />}
        iconBg="bg-red-100"
        iconColor="text-red-600"
        trend={-2.1}
      />
    </div>
  );
}