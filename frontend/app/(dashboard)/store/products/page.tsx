"use client";

import ProductListing from "../_components/ProductListing";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Product listing with all filters */}
        <ProductListing title="All Products" showFilters={true} />
      </main>
    </div>
  );
}
