"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function ChatInput({
  onSendMessage,
  placeholder = "Type your message...",
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "24px";
      }
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 120) + "px";
    }
  }, [message]);

  // Handle enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="px-4 md:px-6 pb-4 pt-2">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div
          className={cn(
            "relative flex items-end rounded-lg border bg-white transition-all duration-200",
            isFocused
              ? "border-primary/50 shadow-sm ring-1 ring-primary/20"
              : "border-gray-200 hover:border-gray-300",
            disabled && "opacity-70 cursor-not-allowed"
          )}
        >
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "flex-1 min-h-[40px] max-h-[120px] py-2.5 pl-4 pr-12",
              "resize-none overflow-auto text-gray-800 bg-transparent",
              "focus:outline-none placeholder:text-gray-400",
              disabled && "cursor-not-allowed"
            )}
            rows={1}
          />

          <div className="absolute bottom-1.5 right-1.5 flex items-center">
            <Button
              type="submit"
              size="sm"
              variant={message.trim() ? "default" : "ghost"}
              className={cn(
                "rounded-full w-8 h-8 p-0 flex items-center justify-center transition-colors",
                !message.trim() && "text-gray-400 hover:bg-gray-50",
                message.trim() && "bg-primary text-white hover:bg-primary/90"
              )}
              disabled={!message.trim() || disabled}
            >
              <Send
                size={16}
                className={message.trim() ? "text-white" : "text-gray-400"}
              />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
