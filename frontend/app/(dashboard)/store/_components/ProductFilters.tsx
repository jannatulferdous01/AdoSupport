import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { categories, priceRanges, ageGroups } from "../_data/storeData";

interface ProductFiltersProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedPriceRanges: string[];
  setSelectedPriceRanges: React.Dispatch<React.SetStateAction<string[]>>;
  selectedAgeGroups: string[];
  setSelectedAgeGroups: React.Dispatch<React.SetStateAction<string[]>>;
  clearFilters: () => void;
  activeFiltersCount: number;
  disableCategoryFilter?: boolean;
}

export default function ProductFilters({
  selectedCategory,
  setSelectedCategory,
  selectedPriceRanges,
  setSelectedPriceRanges,
  selectedAgeGroups,
  setSelectedAgeGroups,
  clearFilters,
  activeFiltersCount,
  disableCategoryFilter = false,
}: ProductFiltersProps) {
  // Toggle price range selection
  const togglePriceRange = (id: string) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle age group selection
  const toggleAgeGroup = (id: string) => {
    setSelectedAgeGroups((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="sticky top-24 space-y-6">
      <div className="flex items-center justify-between">
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-gray-500 hover:text-gray-900"
            onClick={clearFilters}
          >
            Clear all
          </Button>
        )}
      </div>

      <div>
        {activeFiltersCount > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Active filters:</p>
            <div className="flex flex-wrap gap-2">
              {selectedCategory && !disableCategoryFilter && (
                <Badge
                  variant="secondary"
                  className="px-2 py-1 gap-1 font-normal"
                >
                  {selectedCategory}
                  <button
                    className="ml-1 text-gray-400 hover:text-gray-700"
                    onClick={() => setSelectedCategory(null)}
                  >
                    <X size={14} />
                  </button>
                </Badge>
              )}
              {selectedPriceRanges.map((rangeId) => (
                <Badge
                  key={rangeId}
                  variant="secondary"
                  className="px-2 py-1 gap-1 font-normal"
                >
                  {priceRanges.find((r) => r.id === rangeId)?.label}
                  <button
                    className="ml-1 text-gray-400 hover:text-gray-700"
                    onClick={() => togglePriceRange(rangeId)}
                  >
                    <X size={14} />
                  </button>
                </Badge>
              ))}
              {selectedAgeGroups.map((groupId) => (
                <Badge
                  key={groupId}
                  variant="secondary"
                  className="px-2 py-1 gap-1 font-normal"
                >
                  {ageGroups.find((g) => g.id === groupId)?.label}
                  <button
                    className="ml-1 text-gray-400 hover:text-gray-700"
                    onClick={() => toggleAgeGroup(groupId)}
                  >
                    <X size={14} />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Accordion
          type="multiple"
          defaultValue={["category", "price", "age"]}
          className="space-y-4"
        >
          {!disableCategoryFilter && (
            <AccordionItem value="category" className="border-b-0">
              <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                Category
              </AccordionTrigger>
              <AccordionContent className="pt-1 pb-3">
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={selectedCategory === category.name}
                        onCheckedChange={() =>
                          setSelectedCategory(
                            selectedCategory === category.name
                              ? null
                              : category.name
                          )
                        }
                      />
                      <Label
                        htmlFor={`category-${category.id}`}
                        className="ml-2 text-sm cursor-pointer"
                      >
                        {category.name}
                        <span className="text-gray-400 ml-1">
                          ({category.count})
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          <AccordionItem value="price" className="border-b-0">
            <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
              Price Range
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-3">
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <div key={range.id} className="flex items-center">
                    <Checkbox
                      id={`price-${range.id}`}
                      checked={selectedPriceRanges.includes(range.id)}
                      onCheckedChange={() => togglePriceRange(range.id)}
                    />
                    <Label
                      htmlFor={`price-${range.id}`}
                      className="ml-2 text-sm cursor-pointer"
                    >
                      {range.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="age" className="border-b-0">
            <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
              Age Group
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-3">
              <div className="space-y-2">
                {ageGroups.map((group) => (
                  <div key={group.id} className="flex items-center">
                    <Checkbox
                      id={`age-${group.id}`}
                      checked={selectedAgeGroups.includes(group.id)}
                      onCheckedChange={() => toggleAgeGroup(group.id)}
                    />
                    <Label
                      htmlFor={`age-${group.id}`}
                      className="ml-2 text-sm cursor-pointer"
                    >
                      {group.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
