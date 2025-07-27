"use client";

import { useState, useEffect } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import ProductFilters from "./ProductFilters";
import MobileFilters from "./MobileFilters";
import ProductCard from "./ProductCard";
import { products } from "../_data/storeData";

interface ProductListingProps {
  initialCategory?: string | null;
  title?: string;
  showFilters?: boolean;
}

export default function ProductListing({
  initialCategory = null,
  title = "All Products",
  showFilters = true,
}: ProductListingProps) {
  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategory
  );
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Update active filters count
  useEffect(() => {
    const count =
      (selectedCategory ? 1 : 0) +
      selectedPriceRanges.length +
      selectedAgeGroups.length;
    setActiveFiltersCount(count);
  }, [selectedCategory, selectedPriceRanges, selectedAgeGroups]);

  // Update selected category when initialCategory changes
  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory(initialCategory);
    setSelectedPriceRanges([]);
    setSelectedAgeGroups([]);
    setSearchQuery("");
    setSortOption("featured");
  };

  // Apply filters to products
  const filteredProducts = products.filter((product) => {
    // Category filter
    if (selectedCategory && product.category !== selectedCategory) {
      return false;
    }

    // Price range filter
    if (selectedPriceRanges.length > 0) {
      const price = product.discountPrice || product.price;
      const inPriceRange = selectedPriceRanges.some((rangeId) => {
        const range = {
          "under-15": { min: 0, max: 15 },
          "15-30": { min: 15, max: 30 },
          "30-50": { min: 30, max: 50 },
          "over-50": { min: 50, max: Infinity },
        }[rangeId];

        if (!range) return false;
        return price >= range.min && price <= range.max;
      });
      if (!inPriceRange) return false;
    }

    // Age group filter
    if (selectedAgeGroups.length > 0) {
      const matchesAgeGroup = selectedAgeGroups.some((group) => {
        if (group === "parent" && product.category === "Parent Resources")
          return true;
        if (group === "professional" && product.name.includes("Professional"))
          return true;
        return true; // Simplified matching for demo
      });
      if (!matchesAgeGroup) return false;
    }

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return (a.discountPrice || a.price) - (b.discountPrice || b.price);
      case "price-high":
        return (b.discountPrice || b.price) - (a.discountPrice || a.price);
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return a.isNew ? -1 : b.isNew ? 1 : 0;
      default:
        return a.isBestseller ? -1 : b.isBestseller ? 1 : 0;
    }
  });

  return (
    <section>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {selectedCategory || title}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {sortedProducts.length} products
            {activeFiltersCount > 0 &&
              ` (${activeFiltersCount} filters applied)`}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search input */}
          <div className="relative flex-2 w-full">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-3 pr-8"
            />
            {searchQuery && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                onClick={() => setSearchQuery("")}
              >{""}
                <X size={16} />
              </button>
            )}
          </div>

          {/* Sort options */}
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>

          {/* Mobile filter button */}
          {showFilters && (
            <div className="block sm:hidden">
              <MobileFilters
                show={showMobileFilters}
                onOpenChange={setShowMobileFilters}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedPriceRanges={selectedPriceRanges}
                setSelectedPriceRanges={setSelectedPriceRanges}
                selectedAgeGroups={selectedAgeGroups}
                setSelectedAgeGroups={setSelectedAgeGroups}
                clearFilters={clearFilters}
                activeFiltersCount={activeFiltersCount}
                disableCategoryFilter={!!initialCategory}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop filters sidebar */}
        {showFilters && (
          <div className="hidden sm:block w-64 shrink-0">
            <ProductFilters
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedPriceRanges={selectedPriceRanges}
              setSelectedPriceRanges={setSelectedPriceRanges}
              selectedAgeGroups={selectedAgeGroups}
              setSelectedAgeGroups={setSelectedAgeGroups}
              clearFilters={clearFilters}
              activeFiltersCount={activeFiltersCount}
              disableCategoryFilter={!!initialCategory}
            />
          </div>
        )}

        {/* Product grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
            {sortedProducts.length > 0 ? (
              sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="h-full"
                />
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <div className="mx-auto h-24 w-24 text-gray-400 flex items-center justify-center rounded-full bg-gray-50">
                  <Filter size={24} />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No products found
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Try adjusting your filters or search query to find what
                  you&apos;re looking for.
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={clearFilters}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
