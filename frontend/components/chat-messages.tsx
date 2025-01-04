import { Message } from "ai";
import React, { FC, useEffect, useRef } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { ChatMessage } from "./chat-message";
import { ChatMessageLoading } from "./chat-message-loading";

interface ChatMessagesProps {
  messages: Message[];
  streaming: boolean;
}

export const ChatMessages: FC<ChatMessagesProps> = ({
  messages,
  streaming,
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1">
      <div className="max-w-3xl mx-auto py-6 space-y-2">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {streaming && <ChatMessageLoading />}
        <div ref={scrollerRef} className="h-[1px]" />
      </div>
    </ScrollArea>
  );
};
