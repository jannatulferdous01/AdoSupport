"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function PromotionBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-primary/10 border-y border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <span className="bg-primary text-white text-xs font-medium px-2 py-0.5 rounded shrink-0">
              NEW
            </span>
            <p className="text-sm text-gray-700 pr-2">
              Special discount: Use code{" "}
              <span className="font-mono bg-white px-1.5 py-0.5 rounded border text-xs">
                TEENHEALTH20
              </span>{" "}
              for 20% off your first order!
            </p>
          </div>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 p-1 shrink-0"
            onClick={() => setIsVisible(false)}
            aria-label="Close promotion"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
