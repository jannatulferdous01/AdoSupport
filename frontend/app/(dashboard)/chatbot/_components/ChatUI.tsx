"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bot, MessageSquare, ArrowRight } from "lucide-react";
import ChatHeader from "./ChatHeader";
import ChatSidebar from "./ChatSidebar";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { useChat } from "@/hooks/useChat";
import { useAppSelector } from "@/redux/hook";

interface ChatUIProps {
  title: string;
  description: string;
  welcomeMessage: string;
  userRole: string;
}

export default function ChatUI({
  title,
  description,
  welcomeMessage,
  userRole,
}: ChatUIProps) {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const token = useAppSelector((store) => store?.user?.token);

  const { messages, sendMessage, isLoading, isStreaming, clearMessages } =
    useChat(token);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMsg = {
        id: "welcome",
        role: "assistant" as const,
        content: welcomeMessage,
        timestamp: new Date(),
      };
    }
  }, [welcomeMessage]);

  // Sample chat history for sidebar
  const chatHistory = [
    { id: 1, title: "Dealing with stress", date: "Today" },
    { id: 2, title: "Healthy communication tips", date: "Yesterday" },
    { id: 3, title: "School challenges", date: "May 20" },
  ];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  useEffect(() => {
    if (messages.length > 0) {
      setShowWelcome(false);
    }
  }, [messages.length]);

  const handleNewChat = () => {
    clearMessages();
  };

  const suggestedPrompts =
    userRole === "parent"
      ? [
          "How to talk to my teen about mental health?",
          "Signs my teen might be struggling",
        ]
      : ["How can I manage stress?", "Tips for better sleep"];

  return (
    <div className="flex h-full">
      <ChatSidebar
        show={showSidebar}
        onClose={() => setShowSidebar(!showSidebar)}
        chatHistory={chatHistory}
        onNewChat={handleNewChat}
        userRole={userRole}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
        <ChatHeader
          title={title}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
        />

        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 py-6 md:px-6 bg-white"
        >
          {messages.length === 0 && (
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
                    onClick={() => sendMessage(prompt)}
                    disabled={isLoading || isStreaming}
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
            {/* Welcome message */}
            {showWelcome && (
              <ChatMessage
                role="assistant"
                content={welcomeMessage}
                timestamp={new Date()}
              />
            )}

            {/* Chat messages */}
            {messages.map((message, index) => (
              <ChatMessage
                key={`${message.id}-${index}`}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
                isStreaming={message.isStreaming}
              />
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 p-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <ChatInput
              onSendMessage={sendMessage}
              disabled={isLoading || isStreaming}
              placeholder="Type your message..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
