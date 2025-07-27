"use client";

import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    id: 1,
    content:
      "The journals we purchased for our therapy practice have been invaluable for our adolescent clients. The structured prompts guide them toward meaningful reflection without feeling too clinical.",
    name: "Dr. Sarah Johnson",
    title: "Child Psychologist",
    rating: 5,
  },
  {
    id: 2,
    content:
      "As a parent of a teen with anxiety, finding the right resources has been challenging. The mindfulness kit has given my daughter practical tools she actually uses daily. The difference in her confidence is remarkable.",
    name: "Michael P.",
    title: "Parent of a 15-year-old",
    rating: 5,
  },
  {
    id: 3,
    content:
      "I bought the sleep improvement kit for my son who was struggling with insomnia before exams. The combination of the weighted blanket and sleep sounds has transformed his sleep routine completely.",
    name: "Anita R.",
    title: "Mother of two teenagers",
    rating: 5,
  },
  {
    id: 4,
    content:
      "The conversation cards helped break down barriers in our family. We've had more meaningful discussions in the past month than in the entire year before. These products really understand adolescent psychology.",
    name: "James & Lena T.",
    title: "Parents",
    rating: 4,
  },
];

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  // Auto advance testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-12">
          What Our Community Says
        </h2>

        <div className="relative">
          <div className="flex justify-center mb-8">
            <div className="bg-gray-50 rounded-lg p-8 shadow-sm border border-gray-100 w-full">
              <div className="flex mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={cn(
                      "mr-1",
                      i < currentTestimonial.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <p className="text-lg italic text-gray-600 mb-6">
                "{currentTestimonial.content}"
              </p>
              <div>
                <p className="font-semibold text-gray-900">
                  {currentTestimonial.name}
                </p>
                <p className="text-sm text-gray-500">
                  {currentTestimonial.title}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all",
                  index === currentIndex
                    ? "bg-primary w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                )}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 -translate-y-1/2 -left-12 hidden md:flex"
            onClick={prevTestimonial}
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 -translate-y-1/2 -right-12 hidden md:flex"
            onClick={nextTestimonial}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}
