import { ChatMessage } from "@/types";
import { useState, useCallback } from "react";

export const useChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStreamingId, setCurrentStreamingId] = useState<string | null>(null);

  const generateUniqueId = useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const addUserMessage = useCallback((content: string): string => {
    const messageId = generateUniqueId();
    const newMessage: ChatMessage = {
      id: messageId,
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    return messageId;
  }, [generateUniqueId]);

  const startAssistantMessage = useCallback((): string => {
    const messageId = generateUniqueId();
    const newMessage: ChatMessage = {
      id: messageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };
    setMessages((prev) => [...prev, newMessage]);
    setCurrentStreamingId(messageId);
    return messageId;
  }, [generateUniqueId]);

  const appendToMessage = useCallback((messageId: string, chunk: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, content: msg.content + chunk } : msg
      )
    );
  }, []);

  const finishStreaming = useCallback((messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isStreaming: false } : msg
      )
    );
    setCurrentStreamingId(null);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentStreamingId(null);
  }, []);

  return {
    messages,
    currentStreamingId,
    addUserMessage,
    startAssistantMessage,
    appendToMessage,
    finishStreaming,
    clearMessages,
  };
};
