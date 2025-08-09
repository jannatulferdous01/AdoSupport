import { useState, useRef } from "react";
import { useChatMessages } from "./useChatMessages";
import { useChatStreaming } from "./useChatStreaming";

export const useChat = (token: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const activeStreamingIdRef = useRef<string | null>(null);

  const {
    messages,
    currentStreamingId,
    addUserMessage,
    startAssistantMessage,
    appendToMessage,
    finishStreaming,
    clearMessages,
  } = useChatMessages();

  const { sendStreamingMessage, isStreaming } = useChatStreaming({
    onStreamStart: () => {
      setIsLoading(false);
      setError(null);
    },
    onChunkReceived: (chunk: string) => {
      if (activeStreamingIdRef.current) {
        appendToMessage(activeStreamingIdRef.current, chunk);
      } else {
        console.log("❌ No active streaming ID");
      }
    },
    onStreamEnd: () => {
      if (activeStreamingIdRef.current) {
        finishStreaming(activeStreamingIdRef.current);
        activeStreamingIdRef.current = null;
      }
    },
    onError: (errorMessage: string) => {
      setError(errorMessage);
      setIsLoading(false);
      if (activeStreamingIdRef.current) {
        finishStreaming(activeStreamingIdRef.current);
        activeStreamingIdRef.current = null;
      }
    },
    token,
  });

  const sendMessage = async (content: string) => {
    if (!content.trim() || isStreaming) return;

    setError(null);
    setIsLoading(true);

    const userMessageId = addUserMessage(content);

    const assistantMessageId = startAssistantMessage();
    activeStreamingIdRef.current = assistantMessageId;

    try {
      await sendStreamingMessage(content);
    } catch (err) {
      console.log("💥 Send message error:", err);
      setError("Failed to send message");
      if (assistantMessageId) {
        finishStreaming(assistantMessageId);
        activeStreamingIdRef.current = null;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    isLoading,
    isStreaming,
    error,
    clearMessages,
  };
};
