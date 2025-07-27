"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bot, MessageSquare, ArrowRight } from "lucide-react";
import ChatHeader from "./ChatHeader";
import ChatSidebar from "./ChatSidebar";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatUIProps {
  title: string;
  description: string;
  welcomeMessage: string;
  userRole: string;
}

// Simple dummy message generator
const getDummyMessages = (userRole: string): Message[] => {
  // Different messages based on user role
  const conversations: { role: "user" | "assistant"; content: string }[] =
    userRole === "parent"
      ? [
          {
            role: "user" as const,
            content: "How can I talk to my teen about anxiety?",
          },
          {
            role: "assistant" as const,
            content:
              "Start by creating a judgment-free space. Ask open-ended questions and listen without immediately trying to solve the problem. Share that anxiety is normal and manageable with support.",
          },
          {
            role: "user" as const,
            content: "My teen seems withdrawn lately",
          },
          {
            role: "assistant" as const,
            content:
              "This could be a sign they're processing emotions. Try casual check-ins during neutral activities like driving or walking. Let them know you're there without pressuring them.",
          },
        ]
      : [
          {
            role: "user" as const,
            content: "I've been feeling anxious about school",
          },
          {
            role: "assistant" as const,
            content:
              "School anxiety is common. Try identifying specific stressors - certain subjects, social situations, or something else? Small steps like preparing the night before and deep breathing can help make each day more manageable.",
          },
          {
            role: "user" as const,
            content: "How can I make new friends?",
          },
          {
            role: "assistant" as const,
            content:
              "Start by joining activities you enjoy - this connects you with people sharing your interests. Ask questions and show interest in others. Remember that quality friendships matter more than quantity.",
          },
        ];

  // Add timestamps to messages
  const now = new Date();
  return conversations.map((msg, index) => ({
    ...msg,
    timestamp: new Date(now.getTime() - (10 - index) * 60000),
  }));
};

export default function ChatUI({
  title,
  description,
  welcomeMessage,
  userRole,
}: ChatUIProps) {
  // Initialize with welcome message
  const [messages, setMessages] = useState<Message[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load dummy messages on component mount
  useEffect(() => {
    // Set a welcome message from assistant first
    setMessages([
      {
        role: "assistant",
        content: welcomeMessage,
        timestamp: new Date(),
      },
    ]);

    // After a delay, add some dummy conversation
    const timer = setTimeout(() => {
      setMessages((prev) => [...prev, ...getDummyMessages(userRole)]);
    }, 1000);

    return () => clearTimeout(timer);
  }, [welcomeMessage, userRole]);

  // Sample chat history for sidebar
  const chatHistory = [
    { id: 1, title: "Dealing with stress", date: "Today" },
    { id: 2, title: "Healthy communication tips", date: "Yesterday" },
    { id: 3, title: "School challenges", date: "May 20" },
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Send message function
  const handleSendMessage = (content: string) => {
    if (!content.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate response delay
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content:
          "I understand your concerns. Let me help you with that. What specific aspects would you like to know more about?",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  // New chat function
  const handleNewChat = () => {
    setMessages([
      {
        role: "assistant",
        content: welcomeMessage,
        timestamp: new Date(),
      },
    ]);
  };

  // Suggested prompts based on user role
  const suggestedPrompts =
    userRole === "parent"
      ? [
          "How to talk to my teen about mental health?",
          "Signs my teen might be struggling",
        ]
      : ["How can I manage stress?", "Tips for better sleep"];

  return (
    <div className="flex h-full">
      {/* Chat history sidebar */}
      <ChatSidebar
        show={showSidebar}
        onClose={() => setShowSidebar(!showSidebar)}
        chatHistory={chatHistory}
        onNewChat={handleNewChat}
        userRole={userRole}
      />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
        <ChatHeader
          title={title}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
        />

        {/* Chat messages container with white background */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 py-6 md:px-6 bg-white"
        >
          {messages.length === 1 && (
            <div className="max-w-2xl mx-auto text-center mb-8 mt-12">
              <Bot className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-xl font-semibold mb-2">{title}</h2>
              <p className="text-gray-600 mb-8">{description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg mx-auto">
                {suggestedPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="flex items-center justify-between gap-2 h-auto py-3 hover:bg-primary/5"
                    onClick={() => handleSendMessage(prompt)}
                  >
                    <div className="flex gap-3 items-center">
                      <MessageSquare
                        size={15}
                        className="text-primary/70 flex-shrink-0"
                      />
                      <span className="text-left">{prompt}</span>
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-primary/70 flex-shrink-0"
                    />
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length > 1 &&
              messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  role={message.role}
                  content={message.content}
                  timestamp={message.timestamp}
                />
              ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-start gap-3 animate-pulse">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot size={16} className="text-primary" />
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-none h-10 w-16"></div>
              </div>
            )}
          </div>
        </div>

        {/* Input area */}
        <div className="border-t border-gray-100 p-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={isLoading}
              placeholder="Type your message..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
