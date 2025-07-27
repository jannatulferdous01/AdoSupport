"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import CustomForm from "@/components/form/CustomForm";
import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";
import FormTextarea from "@/components/form/FormTextarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Zod Schema
const createProductSchema = z.object({
  title: z
    .string()
    .min(1, "Product title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),

  category: z.enum(["books", "resources", "courses", "therapy"], {
    required_error: "Please select a category",
  }),

  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .min(0.01, "Price must be greater than 0")
    .max(9999.99, "Price cannot exceed $9,999.99"),

  stock: z
    .number({ invalid_type_error: "Stock must be a number" })
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
    .max(9999, "Stock cannot exceed 9,999"),

  author: z
    .string()
    .min(1, "Author/Creator is required")
    .min(2, "Author name must be at least 2 characters")
    .max(50, "Author name must be less than 50 characters"),

  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
});

type CreateProductFormData = z.infer<typeof createProductSchema>;

interface CreateProductFormProps {
  onSubmit: (data: CreateProductFormData) => void;
  onCancel: () => void;
  loading: boolean;
}

const categoryOptions = [
  { label: "📚 Books", value: "books" },
  { label: "📄 Resources", value: "resources" },
  { label: "🎓 Courses", value: "courses" },
  { label: "💬 Therapy", value: "therapy" },
];

export default function CreateProductForm({
  onSubmit,
  onCancel,
  loading,
}: CreateProductFormProps) {
  const defaultValues: Partial<CreateProductFormData> = {
    title: "",
    category: undefined,
    price: undefined,
    stock: undefined,
    author: "",
    description: "",
  };

  const handleFormSubmit = (data: any) => {
    const transformedData = {
      ...data,
      price: data.price ? parseFloat(data.price) : undefined,
      stock: data.stock ? parseInt(data.stock, 10) : undefined,
    };

    // Validate with Zod schema
    const validationResult = createProductSchema.safeParse(transformedData);

    if (validationResult.success) {
      onSubmit(validationResult.data);
    } else {
      console.error("Validation errors:", validationResult.error.errors);
    }
  };

  const handleFormError = (errors: any) => {
    console.error("Form validation errors:", errors);
  };

  return (
    <div className="space-y-6">
      <CustomForm
        onSubmit={handleFormSubmit}
        onError={handleFormError}
        defaultValues={defaultValues}
        resolver={zodResolver(createProductSchema)}
        className="space-y-6"
      >
        {/* Title and Category Row */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormInput
            name="title"
            label="Product Title"
            placeholder="Enter product title"
            required
          />

          <FormSelect
            name="category"
            label="Category"
            placeholder="Select a category"
            options={categoryOptions}
            required
          />
        </div>

        {/* Price and Stock Row */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormInput
            name="price"
            label="Price ($)"
            type="number"
            placeholder="0.00"
            required
          />

          <FormInput
            name="stock"
            label="Stock Quantity"
            type="number"
            placeholder="0"
            required
          />
        </div>

        {/* Author */}
        <FormInput
          name="author"
          label="Author/Creator"
          placeholder="Enter author or creator name"
          required
        />

        {/* Description */}
        <FormTextarea
          name="description"
          label="Description"
          placeholder="Enter product description (optional)"
          rows={3}
        />

        {/* Info Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Fields marked with * are required. The product will be set to active
            status by default.
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="min-w-[120px]">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Product"
            )}
          </Button>
        </div>
      </CustomForm>
    </div>
  );
}

export type { CreateProductFormData };
