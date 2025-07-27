"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReviewItem from "./ReviewItem";

interface ProductReviewsProps {
  productId: string;
  rating: number;
  reviewCount: number;
}

// Sample review data
const sampleReviews = [
  {
    id: "1",
    author: "Emma T.",
    role: "Verified Buyer",
    rating: 5,
    date: "2 months ago",
    title: "Transformative for my teenager",
    content:
      "This journal has been a game changer for my 15-year-old daughter who was struggling with anxiety. She uses it daily and I've noticed significant improvements in her ability to manage stress. The prompts are age-appropriate and engaging. Highly recommend for any parent looking to support their teen's mental health.",
    helpful: 24,
    isHelpful: false,
  },
  {
    id: "2",
    author: "Jason M.",
    role: "Teen, 16",
    rating: 4,
    date: "3 weeks ago",
    title: "Helps with school stress",
    content:
      "I was skeptical at first but my therapist recommended this journal. It's actually pretty cool and doesn't feel childish. The daily check-ins help me track my mood patterns and the exercises are quick but effective. Knocked off one star because some pages feel repetitive.",
    helpful: 18,
    isHelpful: false,
  },
  {
    id: "3",
    author: "Sarah K.",
    role: "Parent",
    rating: 5,
    date: "1 month ago",
    title: "Great quality and thoughtful design",
    content:
      "Not only is the content excellent, but the physical quality of this journal is outstanding. Sturdy cover, thick pages that don't allow ink to bleed through, and a really nice bookmark ribbon. My son uses it every evening as part of his wind-down routine and it's helped tremendously with his sleep quality.",
    helpful: 12,
    isHelpful: false,
  },
  {
    id: "4",
    author: "David R.",
    role: "School Counselor",
    rating: 5,
    date: "2 months ago",
    title: "Recommend to all my students",
    content:
      "As a high school counselor, I've recommended this journal to dozens of students dealing with anxiety and stress. The feedback has been universally positive. The science-based approach and accessibility of the exercises make it an excellent tool for adolescents.",
    helpful: 32,
    isHelpful: false,
  },
  {
    id: "5",
    author: "Olivia P.",
    role: "Teen, 14",
    rating: 3,
    date: "3 weeks ago",
    title: "Good but could be better",
    content:
      "The journal has some helpful pages but I wish it was more colorful and had stickers or something to make it more fun to use. Sometimes the prompts feel too serious. It has helped me with some anxiety issues though.",
    helpful: 7,
    isHelpful: false,
  },
];

// Star distribution
const starDistribution = [
  { star: 5, percentage: 75, count: 96 },
  { star: 4, percentage: 15, count: 19 },
  { star: 3, percentage: 7, count: 9 },
  { star: 2, percentage: 2, count: 3 },
  { star: 1, percentage: 1, count: 1 },
];

export default function ProductReviews({
  productId,
  rating,
  reviewCount,
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState(sampleReviews);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("most-helpful");

  const markHelpful = (reviewId: string) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === reviewId
          ? { ...review, helpful: review.helpful + 1, isHelpful: true }
          : review
      )
    );
  };

  // Filter and sort reviews
  const filteredReviews =
    filter === "all"
      ? reviews
      : reviews.filter((review) => review.rating === parseInt(filter));

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sort === "most-recent") return a.date > b.date ? -1 : 1;
    if (sort === "highest-rating") return b.rating - a.rating;
    if (sort === "lowest-rating") return a.rating - b.rating;
    return b.helpful - a.helpful; // most-helpful is default
  });

  return (
    <div id="reviews" className="py-8 sm:py-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Customer Reviews
      </h2>

      <div className="grid md:grid-cols-12 gap-8">
        {/* Reviews summary */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <span className="text-3xl font-bold text-gray-900 mr-2">
                {rating.toFixed(1)}
              </span>
              <div>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.floor(rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-200"
                      }
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  Based on {reviewCount} reviews
                </p>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Star distribution */}
            <div className="space-y-2">
              {starDistribution.map((item) => (
                <div key={item.star} className="flex items-center gap-2">
                  <button
                    onClick={() => setFilter(item.star.toString())}
                    className="flex items-center hover:underline text-gray-600 text-sm w-14"
                  >
                    <span>{item.star}</span>
                    <Star
                      size={12}
                      className="ml-1 fill-amber-400 text-amber-400"
                    />
                  </button>
                  <Progress value={item.percentage} className="h-2 flex-1" />
                  <span className="text-sm text-gray-500 w-8 text-right">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <Button className="w-full" variant="outline">
              Write a Review
            </Button>
          </div>
        </div>

        {/* Reviews list */}
        <div className="md:col-span-8 lg:col-span-9">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="text-lg font-medium">
              {filteredReviews.length}{" "}
              {filteredReviews.length === 1 ? "Review" : "Reviews"}
              {filter !== "all" && ` • ${filter} stars`}
            </h3>

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-9 w-[170px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="most-helpful">Most Helpful</SelectItem>
                <SelectItem value="most-recent">Most Recent</SelectItem>
                <SelectItem value="highest-rating">Highest Rating</SelectItem>
                <SelectItem value="lowest-rating">Lowest Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Review items using the new component */}
          {sortedReviews.length > 0 ? (
            <div className="space-y-4">
              {sortedReviews.map((review) => (
                <ReviewItem
                  key={review.id}
                  review={review}
                  onMarkHelpful={markHelpful}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <p className="text-gray-500">
                No reviews match your selected filter.
              </p>
              <Button
                variant="link"
                onClick={() => setFilter("all")}
                className="mt-2"
              >
                View all reviews
              </Button>
            </div>
          )}

          {filter === "all" && (
            <div className="mt-8 text-center">
              <Button variant="outline">Load More Reviews</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
