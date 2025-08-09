import { StreamResponse } from "@/types";
import { useState, useCallback } from "react";

interface UseChatStreamingProps {
  onChunkReceived: (chunk: string) => void;
  onStreamStart: () => void;
  onStreamEnd: (chatId?: string) => void;
  onError: (error: string) => void;
  token?: string;
}

export const useChatStreaming = ({
  onChunkReceived,
  onStreamStart,
  onStreamEnd,
  onError,
  token,
}: UseChatStreamingProps) => {
  const [isStreaming, setIsStreaming] = useState(false);

  const sendStreamingMessage = useCallback(
    async (message: string, chatId?: string) => {
      setIsStreaming(true);
      onStreamStart();

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/chatbot/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              query: message,
              ...(chatId && { chat_id: chatId }),
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("No reader available");
        }

        let fullResponse = "";
        let isProcessing = false;

        const typeCharacterByCharacter = async (text: string) => {
          if (isProcessing) return;
          isProcessing = true;

          for (let i = 0; i < text.length; i++) {
            onChunkReceived(text[i]);

            let delay = 40;
            const char = text[i];

            // delays for different cases
            if (char === " ") delay = 25;
            if (char === "\n") delay = 200;
            if (char === "." || char === "!") delay = 150;
            if (char === ",") delay = 80;

            await new Promise((resolve) => setTimeout(resolve, delay));
          }
          isProcessing = false;
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const jsonStr = line.slice(6).trim();
                if (jsonStr === "") continue;

                const data: StreamResponse = JSON.parse(jsonStr);

                switch (data.type) {
                  case "start":
                    break;
                  case "chunk":
                    if (data.content) {
                      fullResponse += data.content;
                    }
                    break;
                  case "end":
                    if (fullResponse && !isProcessing) {
                      await typeCharacterByCharacter(fullResponse);
                    }
                    onStreamEnd(data.chat_id);
                    setIsStreaming(false);
                    return;
                }
              } catch (parseError) {
                console.error("Parse error:", parseError);
              }
            }
          }
        }
      } catch (error) {
        console.error("Streaming error:", error);
        onError(error instanceof Error ? error.message : "Unknown error");
        setIsStreaming(false);
      }
    },
    [onChunkReceived, onStreamStart, onStreamEnd, onError, token]
  );

  return {
    sendStreamingMessage,
    isStreaming,
  };
};
