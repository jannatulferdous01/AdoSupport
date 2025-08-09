import { format } from "date-fns";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import MarkdownMessage from "@/components/chat/MarkdownMessage";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export default function ChatMessage({
  role,
  content,
  timestamp,
  isStreaming = false,
}: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {/* Show bot avatar only for assistant messages */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot size={16} className="text-primary" />
        </div>
      )}

      <div className="max-w-[85%]">
        <div
          className={cn(
            "px-4 py-2.5",
            isUser
              ? "bg-primary text-white rounded-l-2xl rounded-br-2xl"
              : "bg-gray-100 text-gray-800 rounded-r-2xl rounded-bl-2xl rounded-tl-none"
          )}
        >
          {isUser ? (
            <div className="leading-relaxed whitespace-pre-wrap">{content}</div>
          ) : (
            <div>
              <MarkdownMessage content={content} isStreaming={isStreaming} />
              {isStreaming && content === "" && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
              )}
            </div>
          )}
        </div>
        <div
          className={cn(
            "text-xs mt-1 flex text-gray-500",
            isUser ? "justify-end mr-1" : "justify-start ml-1"
          )}
        >
          {format(new Date(timestamp), "h:mm a")}
        </div>
      </div>

      {/* Show user avatar only for user messages */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <User size={16} className="text-primary" />
        </div>
      )}
    </div>
  );
}
