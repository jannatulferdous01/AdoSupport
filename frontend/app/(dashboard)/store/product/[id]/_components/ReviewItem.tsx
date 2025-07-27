import { useState } from "react";
import { Star, ThumbsUp, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ReviewItemProps {
  review: {
    id: string;
    author: string;
    role: string;
    rating: number;
    date: string;
    title: string;
    content: string;
    helpful: number;
    isHelpful: boolean;
  };
  onMarkHelpful: (id: string) => void;
}

export default function ReviewItem({ review, onMarkHelpful }: ReviewItemProps) {
  const [expanded, setExpanded] = useState(false);
  const isLongReview = review.content.length > 280;
  const displayContent =
    isLongReview && !expanded
      ? `${review.content.substring(0, 280)}...`
      : review.content;

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 transition-all hover:shadow-sm">
      <div className="flex items-start gap-3">
        {/* Avatar - balanced size */}
        <Avatar className="h-9 w-9 border border-gray-200">
          <AvatarFallback className="bg-primary/10 text-primary text-sm">
            {getInitials(review.author)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          {/* Header - balanced typography */}
          <div className="flex flex-wrap justify-between items-start gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-gray-900">
                  {review.author}
                </h4>
              </div>

              <div className="flex items-center mt-1">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={cn(
                        i < review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-200"
                      )}
                    />
                  ))}
                </div>
                <span className="ml-2 text-xs text-gray-500">
                  {review.date}
                </span>
                {review.isHelpful && (
                  <div className="ml-2 flex items-center text-xs text-primary">
                    <Check size={12} className="mr-0.5" />
                    <span>You found this helpful</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Review title & content */}
          <div className="mt-3">
            <h3 className="text-sm font-medium text-gray-900 mb-1.5">
              {review.title}
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {displayContent}
            </p>

            {isLongReview && (
              <Button
                variant="link"
                className="p-0 h-auto text-xs mt-1.5"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "Show less" : "Read more"}
              </Button>
            )}
          </div>

          {/* Actions - balanced sizing */}
          <div className="mt-3 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-3 gap-1.5 text-xs text-gray-500 hover:text-gray-700",
                review.isHelpful && "text-primary hover:text-primary"
              )}
              onClick={() => onMarkHelpful(review.id)}
              disabled={review.isHelpful}
            >
              <ThumbsUp
                size={14}
                className={cn(review.isHelpful && "fill-primary")}
              />
              <span>Helpful</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs">
                {review.helpful}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
