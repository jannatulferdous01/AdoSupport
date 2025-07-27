import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { categories, priceRanges, ageGroups } from "../_data/storeData";

interface MobileFiltersProps {
  show: boolean;
  onOpenChange: (open: boolean) => void;
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

export default function MobileFilters({
  show,
  onOpenChange,
  selectedCategory,
  setSelectedCategory,
  selectedPriceRanges,
  setSelectedPriceRanges,
  selectedAgeGroups,
  setSelectedAgeGroups,
  clearFilters,
  activeFiltersCount,
  disableCategoryFilter = false,
}: MobileFiltersProps) {
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
    <Sheet open={show} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Filter size={18} />
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="py-4 flex flex-col gap-5">
          {/* Category filter */}
          {!disableCategoryFilter && (
            <>
              <div>
                <h3 className="text-sm font-medium mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <Checkbox
                        id={`mobile-category-${category.id}`}
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
                        htmlFor={`mobile-category-${category.id}`}
                        className="ml-2 text-sm"
                      >
                        {category.name}
                        <span className="text-gray-400 ml-1">
                          ({category.count})
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Price range filter */}
          <div>
            <h3 className="text-sm font-medium mb-3">Price Range</h3>
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <div key={range.id} className="flex items-center">
                  <Checkbox
                    id={`mobile-price-${range.id}`}
                    checked={selectedPriceRanges.includes(range.id)}
                    onCheckedChange={() => togglePriceRange(range.id)}
                  />
                  <Label
                    htmlFor={`mobile-price-${range.id}`}
                    className="ml-2 text-sm"
                  >
                    {range.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Age group filter */}
          <div>
            <h3 className="text-sm font-medium mb-3">Age Group</h3>
            <div className="space-y-2">
              {ageGroups.map((group) => (
                <div key={group.id} className="flex items-center">
                  <Checkbox
                    id={`mobile-age-${group.id}`}
                    checked={selectedAgeGroups.includes(group.id)}
                    onCheckedChange={() => toggleAgeGroup(group.id)}
                  />
                  <Label
                    htmlFor={`mobile-age-${group.id}`}
                    className="ml-2 text-sm"
                  >
                    {group.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <SheetFooter className="flex-row gap-3 sm:gap-3">
          <Button variant="outline" className="flex-1" onClick={clearFilters}>
            Clear All
          </Button>
          <SheetClose asChild>
            <Button className="flex-1">Apply Filters</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
