"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { ProductData } from "../../_services/mockProductsApi";

interface ProductsTableFiltersProps {
  products: ProductData[];
  onFilteredProducts: (products: ProductData[]) => void;
}

export default function ProductsTableFilters({
  products,
  onFilteredProducts,
}: ProductsTableFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((product) => product.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((product) => product.status === statusFilter);
    }

    onFilteredProducts(filtered);
  }, [searchTerm, categoryFilter, statusFilter, products, onFilteredProducts]);

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStatusFilter("all");
  };

  const hasActiveFilters = searchTerm || categoryFilter !== "all" || statusFilter !== "all";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="books">Books</SelectItem>
            <SelectItem value="resources">Resources</SelectItem>
            <SelectItem value="courses">Courses</SelectItem>
            <SelectItem value="therapy">Therapy</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}