"use client";
import React, { FC, useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import { toast } from "sonner";
import { ChatMessages } from "./chat-messages";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ChatInput } from "./chat-input";
import { notFound, useRouter } from "next/navigation";
import { MessagesSkeleton } from "./messages-skeleton";
import { generateId } from "ai";

interface ChatProps {
  conversationId?: string;
}

export const Chat: FC<ChatProps> = ({ conversationId }) => {
  const [streaming, setStreaming] = useState(false);
  const queryClient = useQueryClient();
  const newConversationId = useRef<string>(generateId());
  const router = useRouter();
  const {
    data,
    isLoading: messagesLoading,
    error,
  } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => api.getConversationMessages(conversationId || ""),
    enabled: !!conversationId,
  });

  const { messages, isLoading, handleInputChange, handleSubmit, stop, input } =
    useChat({
      // id: conversationId || "chat",
      api: `${process.env.NEXT_PUBLIC_API_URL}/api/chat`,
      body: { conversationId: conversationId ?? newConversationId.current },
      credentials: "include",
      experimental_throttle: 50,
      onResponse(response) {
        setStreaming(false);
        console.log(
          "Conversation Id",
          response.headers.get("x-conversation-id")
        );
      },
      onError(error) {
        toast.error(error.message);
      },
      initialMessages: data?.data || [],
      onFinish(message, options) {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
        if (conversationId) {
          queryClient.invalidateQueries({
            queryKey: ["messages", conversationId],
          });
        } else {
          router.push(`/c/${newConversationId.current}`);
        }
      },
    });

  if (error?.message && error.message === "Conversation not found!") {
    return notFound();
  }

  return (
    <div className="flex flex-col h-[calc(100svh-3.5rem)] px-4">
      {messagesLoading ? (
        <MessagesSkeleton />
      ) : (
        <ChatMessages messages={messages} streaming={streaming} />
      )}
      <div className="pb-4">
        <ChatInput
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          input={input}
          isLoading={isLoading}
          stop={stop}
          setStreaming={setStreaming}
        />
      </div>
    </div>
  );
};
