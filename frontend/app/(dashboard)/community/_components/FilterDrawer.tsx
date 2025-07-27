"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { topicsList } from "../_data/mockData";

interface FilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filterOptions: {
    topics: string[];
    sortBy: string;
  };
  setFilterOptions: (options: { topics: string[]; sortBy: string }) => void;
}

export default function FilterDrawer({
  open,
  onOpenChange,
  filterOptions,
  setFilterOptions,
}: FilterDrawerProps) {
  const [localOptions, setLocalOptions] = useState(filterOptions);

  useEffect(() => {
    setLocalOptions(filterOptions);
  }, [filterOptions]);

  const handleTopicChange = (topic: string) => {
    const updatedTopics = localOptions.topics.includes(topic)
      ? localOptions.topics.filter((t) => t !== topic)
      : [...localOptions.topics, topic];

    setLocalOptions({
      ...localOptions,
      topics: updatedTopics,
    });
  };

  const handleSortChange = (value: string) => {
    setLocalOptions({
      ...localOptions,
      sortBy: value,
    });
  };

  const applyFilters = () => {
    setFilterOptions(localOptions);
    onOpenChange(false);
  };

  const resetFilters = () => {
    const resetOptions = {
      topics: [],
      sortBy: "latest",
    };
    setLocalOptions(resetOptions);
    setFilterOptions(resetOptions);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[300px] sm:w-[400px] py-8">
        <SheetHeader className="mb-6">
          <SheetTitle>Filter Posts</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Sort Options */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Sort By</h3>
            <RadioGroup
              value={localOptions.sortBy}
              onValueChange={handleSortChange}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="latest" id="latest" />
                <Label htmlFor="latest">Latest</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="popular" id="popular" />
                <Label htmlFor="popular">Most Popular</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Topics Filter */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Topics</h3>
            <div className="grid grid-cols-2 gap-2">
              {topicsList.map((topic) => (
                <div key={topic} className="flex items-center space-x-2">
                  <Checkbox
                    id={`topic-${topic}`}
                    checked={localOptions.topics.includes(topic)}
                    onCheckedChange={() => handleTopicChange(topic)}
                  />
                  <Label
                    htmlFor={`topic-${topic}`}
                    className="text-sm capitalize"
                  >
                    {topic}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={resetFilters}>
              Reset
            </Button>
            <Button className="flex-1" onClick={applyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
