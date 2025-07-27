"use client";

import { useState } from "react";
import AdminCard from "../../../_components/ui/AdminCard";
import ProductsTableActions from "./table/ProductsTableActions";
import ProductsTableFilters from "./table/ProductsTableFilters";
import { ProductData } from "../_services/mockProductsApi";
import { Badge } from "@/components/ui/badge";
import { Star, Package } from "lucide-react";
import AdminTablePagination from "@/app/admin/_components/ui/AdminTablePagination";

interface ProductsTableProps {
  products: ProductData[];
  loading: boolean;
}

export default function ProductsTable({
  products,
  loading,
}: ProductsTableProps) {
  const [filteredProducts, setFilteredProducts] =
    useState<ProductData[]>(products);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Pagination logic
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const getStatusBadge = (status: ProductData["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case "out_of_stock":
        return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>;
    }
  };

  const getCategoryBadge = (category: ProductData["category"]) => {
    const colors = {
      books: "bg-blue-100 text-blue-800",
      resources: "bg-green-100 text-green-800",
      courses: "bg-purple-100 text-purple-800",
      therapy: "bg-pink-100 text-pink-800",
    };

    return <Badge className={colors[category]}>{category}</Badge>;
  };

  if (loading) {
    return (
      <AdminCard>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="space-y-3">
              {[...Array(itemsPerPage)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AdminCard>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <AdminCard>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Products</h3>
              <p className="text-sm text-gray-600">
                Manage your store products
              </p>
            </div>
          </div>

          <ProductsTableFilters
            products={products}
            onFilteredProducts={setFilteredProducts}
          />

          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No products found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters or add a new product.
            </p>
          </div>
        </div>
      </AdminCard>
    );
  }

  return (
    <AdminCard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Products</h3>
            <p className="text-sm text-gray-600">Manage your store products</p>
          </div>
        </div>

        <ProductsTableFilters
          products={products}
          onFilteredProducts={setFilteredProducts}
        />

        {/* Custom Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">
                        {product.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        by {product.author}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getCategoryBadge(product.category)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium">${product.price}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={
                        product.stock === 0 ? "text-red-600" : "text-gray-900"
                      }
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.sales.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{product.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(product.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ProductsTableActions product={product} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <AdminTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          isLoading={loading}
        />
      </div>
    </AdminCard>
  );
}
