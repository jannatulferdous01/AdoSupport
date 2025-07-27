"use client";

import { useAppSelector } from "@/redux/hook";
import { useEffect, useState } from "react";
import ChatUI from "./_components/ChatUI";

export default function ChatbotPage() {
  const { role, name } = useAppSelector((state) => state.user);
  const [mounted, setMounted] = useState(false);

  // Set page specific configurations based on user role
  const config = {
    adolescent: {
      title: "AI Support Assistant",
      description:
        "Ask me anything about mental health, social situations, or any concerns you might have.",
      welcomeMessage:
        "Hi there! I'm your AI support assistant. How can I help you today?",
    },
    parent: {
      title: "Parent Support Guide",
      description:
        "Ask me about supporting your adolescent's wellbeing or handling specific parenting situations.",
      welcomeMessage:
        "Welcome! I'm here to help you navigate parenting challenges. What would you like guidance on today?",
    },
  };

  // Ensure component mounts properly
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Get correct configuration based on user role
  const userConfig = role === "parent" ? config.parent : config.adolescent;

  return (
    <main className="h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
      <ChatUI
        title={userConfig.title}
        description={userConfig.description}
        welcomeMessage={userConfig.welcomeMessage}
        userRole={role || "adolescent"}
      />
    </main>
  );
}
