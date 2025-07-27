"use client";

import { useState, useEffect } from "react";
import AdminPageHeader from "../../_components/ui/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProductsStats from "./_components/ProductsStats";
import ProductsTable from "./_components/ProductsTable";
import CreateProductDialog from "./_components/CreateProductDialog";
import { mockProductsApi, ProductData } from "./_services/mockProductsApi";
import toast from "react-hot-toast";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Mock data fetching
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsData = await mockProductsApi.fetchProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCreateProduct = async (productData: any) => {
    try {
      const newProduct = await mockProductsApi.createProduct(productData);
      setProducts((prev) => [newProduct, ...prev]);
      setCreateDialogOpen(false);
      toast.success("Product created successfully!");
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <AdminPageHeader
          title="Products Management"
          description="Manage store products, inventory, and pricing"
        />
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <ProductsStats products={products} loading={loading} />

      <ProductsTable products={products} loading={loading} />

      <CreateProductDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateProduct}
      />
    </div>
  );
}
