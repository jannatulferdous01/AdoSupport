"use client";

import { useState } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/redux/hook";
import { ArrowRight, ChevronRight } from "lucide-react";

interface FeaturedProductsProps {
  filter: string;
  onAddToCart: () => void;
  title?: string;
}

// Sample product data
const products = [
  {
    id: "mindful-journal-teen",
    name: "Teen Mindfulness Journal: 90 Days of Emotional Awareness",
    price: 24.99,
    discountPrice: 19.99,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    rating: 4.8,
    reviewCount: 128,
    category: "Journals & Workbooks",
    isNew: false,
    isBestseller: true,
    inStock: true,
    tags: ["bestsellers", "teensfavorites"],
    description:
      "A 90-day guided journal to help teens develop emotional awareness and mindfulness.",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
    ],
  },
  {
    id: "stress-relief-kit",
    name: "Adolescent Stress Relief Kit with Guided Meditation Cards",
    price: 39.99,
    discountPrice: null,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    rating: 4.5,
    reviewCount: 86,
    category: "Mindfulness & Meditation",
    isNew: true,
    isBestseller: false,
    inStock: true,
    tags: ["new", "teensfavorites"],
    description:
      "A kit designed for adolescents to relieve stress, including guided meditation cards.",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
    ],
  },
  {
    id: "sleep-improvement-bundle",
    name: "Teen Sleep Improvement Bundle with Weighted Blanket",
    price: 89.99,
    discountPrice: 79.99,
    image:
      "https://images.unsplash.com/photo-1517817748493-49ec54a32465?ixlib=rb-4.0.3",
    rating: 4.9,
    reviewCount: 215,
    category: "Sleep Improvement",
    isNew: false,
    isBestseller: true,
    inStock: true,
    tags: ["bestsellers", "parentresources"],
    description:
      "A bundle for improving teen sleep, featuring a weighted blanket and sleep aids.",
    images: [
      "https://images.unsplash.com/photo-1517817748493-49ec54a32465?ixlib=rb-4.0.3",
    ],
  },
  {
    id: "anxiety-workbook",
    name: "Anxiety Toolkit for Teens: Interactive Workbook with CBT Techniques",
    price: 29.99,
    discountPrice: null,
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    rating: 4.7,
    reviewCount: 156,
    category: "Journals & Workbooks",
    isNew: false,
    isBestseller: true,
    inStock: true,
    tags: ["bestsellers", "parentresources", "teensfavorites"],
    description:
      "An interactive workbook for teens with CBT techniques to manage anxiety.",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
    ],
  },
  {
    id: "family-conversation-cards",
    name: "Parent-Teen Connection: 100 Conversation Starter Cards",
    price: 18.99,
    discountPrice: 15.99,
    image:
      "https://images.unsplash.com/photo-1517817748493-49ec54a32465?ixlib=rb-4.0.3",
    rating: 4.6,
    reviewCount: 92,
    category: "Activities & Games",
    isNew: false,
    isBestseller: false,
    inStock: true,
    tags: ["parentresources"],
    description:
      "A set of 100 conversation starter cards to strengthen parent-teen connections.",
    images: [
      "https://images.unsplash.com/photo-1517817748493-49ec54a32465?ixlib=rb-4.0.3",
    ],
  },
  {
    id: "relaxation-lamp",
    name: "Adolescent Relaxation Lamp with Sound Machine",
    price: 59.99,
    discountPrice: 49.99,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    rating: 4.3,
    reviewCount: 78,
    category: "Sleep Improvement",
    isNew: true,
    isBestseller: false,
    inStock: true,
    tags: ["new", "teensfavorites"],
    description:
      "A relaxation lamp for adolescents, featuring a built-in sound machine.",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
    ],
  },
  {
    id: "teen-yoga-kit",
    name: "Teen Yoga and Mindfulness Complete Kit",
    price: 45.99,
    discountPrice: null,
    image:
      "https://images.unsplash.com/photo-1517817748493-49ec54a32465?ixlib=rb-4.0.3",
    rating: 4.7,
    reviewCount: 104,
    category: "Physical Wellbeing",
    isNew: true,
    isBestseller: false,
    inStock: true,
    tags: ["new", "teensfavorites", "parentresources"],
    description: "A complete yoga and mindfulness kit designed for teens.",
    images: [
      "https://images.unsplash.com/photo-1517817748493-49ec54a32465?ixlib=rb-4.0.3",
    ],
  },
  {
    id: "emotion-tracker",
    name: "Digital Emotion Tracker & Mood Analysis App (1-Year Subscription)",
    price: 34.99,
    discountPrice: 29.99,
    image:
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    rating: 4.4,
    reviewCount: 67,
    category: "Self-Care Kits",
    isNew: true,
    isBestseller: false,
    inStock: true,
    tags: ["new", "teensfavorites"],
    description:
      "A digital app for tracking emotions and analyzing mood, includes a 1-year subscription.",
    images: [
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
    ],
  },
];

export default function FeaturedProducts({
  filter,
  onAddToCart,
  title,
}: FeaturedProductsProps) {
  const { role } = useAppSelector((state) => state.user);
  const [visibleProducts, setVisibleProducts] = useState(8);

  return (
    <div className="space-y-8 my-4 lg:my-10">
      {/* Section Title with See More action */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Featured Products
          </h2>
          {filter !== "all" && (
            <p className="text-sm text-gray-500 mt-1">
              Curated wellness products for adolescent health
            </p>
          )}
        </div>
        <Link
          href={"/dashboard/store"}
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          See All <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.slice(0, visibleProducts).map((product) => (
          <ProductCard product={product} onAddToCart={onAddToCart} />
        ))}
      </div>

      {/* Empty State - shown when no products match the filter */}
      {products?.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500">
            No products found matching your criteria.
          </p>
          <Button
            variant="link"
            className="mt-2"
            onClick={() => (window.location.href = "/dashboard/store")}
          >
            View all products
          </Button>
        </div>
      )}
    </div>
  );
}
