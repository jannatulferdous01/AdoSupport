"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ArrowRight,
  Brain,
  BookOpen,
  Puzzle,
  HeartPulse,
  Moon,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CategoryCard from "../_components/CategoryCard";

// Dummy categories data with icons
const dummyCategories = [
  {
    id: "mindfulness",
    title: "Mindfulness & Meditation",
    description: "Tools for mental clarity and stress reduction",
    icon: <Brain className="h-6 w-6" />,
    color: "bg-blue-50",
    textColor: "text-blue-600",
    borderColor: "border-blue-100",
    count: 18,
    featured: true,
  },
  {
    id: "journals",
    title: "Journals & Workbooks",
    description: "Express thoughts and track emotional progress",
    icon: <BookOpen className="h-6 w-6" />,
    color: "bg-purple-50",
    textColor: "text-purple-600",
    borderColor: "border-purple-100",
    count: 24,
    featured: true,
  },
  {
    id: "activities",
    title: "Activities & Games",
    description: "Fun ways to develop coping skills and mindfulness",
    icon: <Puzzle className="h-6 w-6" />,
    color: "bg-amber-50",
    textColor: "text-amber-600",
    borderColor: "border-amber-100",
    count: 15,
    featured: true,
  },
  {
    id: "physical",
    title: "Physical Wellbeing",
    description: "Products supporting physical health and stress relief",
    icon: <HeartPulse className="h-6 w-6" />,
    color: "bg-rose-50",
    textColor: "text-rose-600",
    borderColor: "border-rose-100",
    count: 12,
    featured: false,
  },
  {
    id: "sleep",
    title: "Sleep Improvement",
    description: "Solutions for better sleep and relaxation",
    icon: <Moon className="h-6 w-6" />,
    color: "bg-indigo-50",
    textColor: "text-indigo-600",
    borderColor: "border-indigo-100",
    count: 9,
    featured: false,
  },
  {
    id: "selfcare",
    title: "Self-Care Kits",
    description: "Complete packages for adolescent well-being",
    icon: <Package className="h-6 w-6" />,
    color: "bg-emerald-50",
    textColor: "text-emerald-600",
    borderColor: "border-emerald-100",
    count: 7,
    featured: true,
  },
];

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Use the dummy categories data if your import doesn't work
  const categories = dummyCategories;

  return (
    <div className="bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Category
          </h1>
          <Link href="/dashboard/store/products">
            <Button variant="outline" size="sm" className="gap-1">
              All Products <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        {/* Categories grid - using the same CategoryCard component */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              title={category.title}
              description={category.description}
              icon={category.icon}
              color={category.color}
              textColor={category.textColor}
              borderColor={category.borderColor}
              count={category.count}
              href={`/dashboard/store/category/${category.id}`}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
