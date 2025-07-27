import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  X,
  MessageSquare,
  Trash,
  Clock,
  Sparkles,
  Search,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ChatHistoryItem {
  id: number;
  title: string;
  date: string;
}

interface ChatSidebarProps {
  show: boolean;
  onClose: () => void;
  chatHistory: ChatHistoryItem[];
  onNewChat: () => void;
  userRole: string;
}

export default function ChatSidebar({
  show,
  onClose,
  chatHistory,
  onNewChat,
  userRole,
}: ChatSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter chat history based on search query
  const filteredHistory = searchQuery
    ? chatHistory.filter((chat) =>
        chat.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : chatHistory;

  // Sample chat history for demo (you can remove this in production)
  const sampleHistory = [
    { id: 1, title: "Coping with anxiety at school", date: "Today" },
    {
      id: 2,
      title: "How to improve communication with parents",
      date: "Yesterday",
    },
    { id: 3, title: "Building self-confidence", date: "3 days ago" },
    { id: 4, title: "Managing academic pressure", date: "Last week" },
    { id: 5, title: "Dealing with peer pressure", date: "Last week" },
    { id: 6, title: "Healthy social media habits", date: "2 weeks ago" },
  ];

  // Use sample history for demo purposes
  const displayHistory =
    filteredHistory.length > 0 ? filteredHistory : sampleHistory;

  // Handle clicks outside the sidebar on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        show &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        window.innerWidth < 768
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, onClose]);

  // Expanded sidebar
  return (
    <div
      ref={sidebarRef}
      className={cn(
        "h-full bg-white border-r border-gray-100 shadow-[1px_0_5px_rgba(0,0,0,0.03)]",
        "flex flex-col transition-all duration-300 ease-in-out z-40",
        // Always visible on desktop but with varying widths
        "hidden md:flex md:flex-col",
        // On mobile, absolute positioning with z-index
        "md:relative md:z-auto",
        // Width variations
        show ? "md:w-[320px]" : "md:w-[75px]",
        // Mobile positioning
        "fixed inset-y-0 left-0",
        // Mobile visibility
        show
          ? "fixed inset-y-0 left-0 w-[280px] block"
          : "left-[-100%] md:left-0"
      )}
    >
      <div
        className={cn(
          "flex items-center p-4 border-b border-gray-100",
          show ? "justify-between" : "justify-center"
        )}
      >
        {show && (
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-gray-700 text-md">Chat History</h4>
            {displayHistory.length > 0 && (
              <Badge
                variant="outline"
                className="text-xs bg-gray-50 hover:bg-gray-50"
              >
                {displayHistory.length}
              </Badge>
            )}
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="hover:bg-gray-50"
          title={show ? "Collapse sidebar" : "Expand sidebar"}
        >
          {show ? (
            <ChevronLeft size={18} className="text-gray-500" />
          ) : (
            <ChevronRight size={18} className="text-gray-500" />
          )}
        </Button>
      </div>

      <div className={cn("p-4", !show && "flex justify-center")}>
        <Button
          onClick={onNewChat}
          className={cn(
            "bg-primary/5 hover:bg-primary/10 text-primary border-0",
            show ? "w-full justify-start gap-2" : "w-10 h-10 p-0"
          )}
          title="New conversation"
        >
          <PlusCircle size={16} />
          {show && <span>New conversation</span>}
        </Button>
      </div>

      {/* Search input - only show when expanded */}
      {show && (
        <div className="px-4 pb-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations"
              className="pl-9 py-2 h-9 bg-gray-50 border-gray-100 focus-visible:ring-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Chat history list */}
      <div
        className={cn(
          "flex-1 overflow-y-auto",
          show ? "px-3 py-2" : "px-0 py-2"
        )}
      >
        {displayHistory.length > 0 ? (
          <div
            className={cn("space-y-1", !show && "flex flex-col items-center")}
          >
            {displayHistory.map((chat) => (
              <button
                key={chat.id}
                className={cn(
                  "flex items-center gap-3 rounded-md hover:bg-gray-50 text-left transition-colors group",
                  show ? "w-full p-2.5" : "w-10 h-10 justify-center"
                )}
                title={!show ? chat.title : undefined}
              >
                <Clock size={16} className="text-gray-400 shrink-0" />
                {show && (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {chat.title}
                      </p>
                      <p className="text-xs text-gray-400">{chat.date}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 hover:bg-gray-100"
                    >
                      <Trash
                        size={14}
                        className="text-gray-400 hover:text-red-500"
                      />
                    </Button>
                  </>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div
            className={cn(
              "flex flex-col items-center justify-center px-4",
              show ? "h-[200px]" : "h-auto mt-4"
            )}
          >
            <div
              className={cn(
                "rounded-full bg-gray-50 flex items-center justify-center mb-3",
                show ? "w-12 h-12" : "w-10 h-10"
              )}
            >
              <Sparkles size={show ? 20 : 16} className="text-gray-400" />
            </div>
            {show && (
              <>
                <p className="text-sm text-gray-500 text-center">
                  No conversation history yet
                </p>
                <p className="text-xs text-gray-400 text-center mt-1">
                  Start a new chat to see it here
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Info panel - only show when expanded */}
      {show && (
        <div className="p-4 border-t border-gray-100 mt-auto">
          <div
            className={cn(
              "p-4 rounded-lg",
              userRole === "adolescent"
                ? "bg-gradient-to-br from-primary/5 to-primary/10"
                : "bg-gradient-to-br from-secondary/5 to-secondary/10"
            )}
          >
            <p className="text-sm font-medium text-gray-700 mb-1">
              {userRole === "adolescent"
                ? "AI Support Assistant"
                : "Parent Guidance Assistant"}
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              {userRole === "adolescent"
                ? "I'm here to listen and support you. You can ask me about anything."
                : "I can help you navigate challenges in supporting your adolescent."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
