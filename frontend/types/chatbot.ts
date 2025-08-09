export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
};

export type StreamResponse = {
  type: "start" | "chunk" | "end";
  content?: string;
  message?: string;
  chat_id?: string;
};

export type ChatState = {
  messages: ChatMessage[];
  isLoading: boolean;
  currentStreamingId?: string;
};
