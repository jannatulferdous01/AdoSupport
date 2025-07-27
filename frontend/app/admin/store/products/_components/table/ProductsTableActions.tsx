"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { ProductData } from "../../_services/mockProductsApi";

interface ProductsTableActionsProps {
  product: ProductData;
}

export default function ProductsTableActions({ product }: ProductsTableActionsProps) {
  const [loading, setLoading] = useState(false);

  const handleEdit = () => {
    console.log("Edit product:", product.id);
  };

  const handleDelete = () => {
    console.log("Delete product:", product.id);
  };

  const handleView = () => {
    console.log("View product:", product.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleView}>
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Product
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}