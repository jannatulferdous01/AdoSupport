import { Bot, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  title: string;
  onToggleSidebar: () => void;
}

export default function ChatHeader({
  title,
  onToggleSidebar,
}: ChatHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  // Add subtle shadow effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrolled(position > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "border-b border-gray-100 bg-white/95 backdrop-blur-sm py-3 px-4 md:px-6 flex items-center justify-between transition-all duration-200",
        scrolled && "shadow-sm"
      )}
    >
      <div className="flex items-center gap-2.5">
        {/* Mobile menu toggle button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-0.5 p-1.5 hover:bg-gray-50"
          onClick={onToggleSidebar}
          aria-label="Toggle chat history"
        >
          <Menu size={18} className="text-gray-500" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/5 flex items-center justify-center">
            <Bot size={16} className="text-primary" />
          </div>
          <p className="text-sm text-gray-700 font-medium">{title}</p>
        </div>
      </div>

      {/* Right side - empty for now but could add controls later */}
      <div></div>
    </div>
  );
}
