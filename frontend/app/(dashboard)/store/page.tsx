"use client";

import { useState } from "react";
import { useAppSelector } from "@/redux/hook";
import StoreHeader from "./_components/StoreHeader";
import CategoryCard from "./_components/CategoryCard";
import FeaturedProducts from "./_components/FeaturedProducts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Puzzle,
  Brain,
  Heart,
  Moon,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";
import PromotionBanner from "./_components/PromotionBanner";
import TestimonialSlider from "./_components/TestimonialSlider";
import Link from "next/link";

export default function StorePage() {
  const { role } = useAppSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("all");
  const [cartCount, setCartCount] = useState(0);

  const categories = [
    {
      id: "mindfulness",
      title: "Mindfulness & Meditation",
      description: "Tools for mental clarity and stress reduction",
      icon: <Brain className="h-6 w-6" />,
      color: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-100",
      count: 18,
    },
    {
      id: "journals",
      title: "Journals & Workbooks",
      description: "Express thoughts and track progress",
      icon: <BookOpen className="h-6 w-6" />,
      color: "bg-purple-50",
      textColor: "text-purple-600",
      borderColor: "border-purple-100",
      count: 24,
    },
    {
      id: "activities",
      title: "Activities & Games",
      description: "Engaging ways to develop social skills",
      icon: <Puzzle className="h-6 w-6" />,
      color: "bg-amber-50",
      textColor: "text-amber-600",
      borderColor: "border-amber-100",
      count: 15,
    },
    {
      id: "wellbeing",
      title: "Physical Wellbeing",
      description: "Products for better physical health",
      icon: <Heart className="h-6 w-6" />,
      color: "bg-rose-50",
      textColor: "text-rose-600",
      borderColor: "border-rose-100",
      count: 20,
    },
    {
      id: "sleep",
      title: "Sleep Improvement",
      description: "Solutions for better sleep quality",
      icon: <Moon className="h-6 w-6" />,
      color: "bg-indigo-50",
      textColor: "text-indigo-600",
      borderColor: "border-indigo-100",
      count: 12,
    },
    {
      id: "selfcare",
      title: "Self-Care Kits",
      description: "Curated packages for holistic wellness",
      icon: <Sparkles className="h-6 w-6" />,
      color: "bg-emerald-50",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-100",
      count: 9,
    },
  ];

  // Role-specific recommendations
  const roleRecommendations =
    role === "parent" ? "Parent Resources" : "Teen Favorites";

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-primary/5 to-primary/10 py-10 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-xl md:max-w-2xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Wellness Resources for{" "}
              <span className="text-primary">
                {role === "parent" ? "Your Teen" : "Your Journey"}
              </span>
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600">
              Discover evidence-based products designed to support adolescent
              mental and physical wellbeing.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button className="w-full sm:w-auto h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base">
                Shop All Products
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base"
              >
                View Recommendations
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Promotion Banner */}
      <PromotionBanner />

      {/* Category Navigation */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            Shop by Category
          </h2>
          <Link href="/store/categories">
            <Button variant="ghost" className="flex items-center gap-1">
              View all <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              href={`/store/category/${category.id}`}
            />
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <FeaturedProducts
        filter="all"
        onAddToCart={() => setCartCount((prev) => prev + 1)}
      />

      {/* Testimonials */}
      <TestimonialSlider />
    </div>
  );
}
