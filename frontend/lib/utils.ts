import { Conversation } from "@/types";
import { CoreMessage, CoreUserMessage, generateText } from "ai";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getLastUserMessage = (messages: CoreMessage[]) => {
  return messages.filter((message) => message.role === "user").at(-1);
};

export function categorizeConversations(
  conversations: Conversation[]
): Record<string, Conversation[]> {
  const now = new Date();
  const categorized: Record<string, Conversation[]> = {
    Today: [],
    "Previous 7 days": [],
    "Previous 30 days": [],
  };

  conversations.forEach((conversation) => {
    const createdAt = new Date(conversation.createdAt);
    const diffTime = now.getTime() - createdAt.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      categorized["Today"].push(conversation);
    } else if (diffDays <= 7) {
      categorized["Previous 7 days"].push(conversation);
    } else if (diffDays <= 30) {
      categorized["Previous 30 days"].push(conversation);
    } else {
      const currentYear = now.getFullYear();
      const conversationYear = createdAt.getFullYear();
      const conversationMonth = createdAt.getMonth();

      let category: string;
      if (conversationYear === currentYear) {
        if (conversationMonth === 11 && now.getMonth() === 0) {
          category = currentYear.toString();
        } else {
          category = createdAt.toLocaleString("default", { month: "long" });
        }
      } else {
        category = conversationYear.toString();
      }

      if (!categorized[category]) {
        categorized[category] = [];
      }
      categorized[category].push(conversation);
    }
  });

  // Remove empty categories
  return Object.fromEntries(
    Object.entries(categorized).filter(
      ([_, conversations]) => conversations.length > 0
    )
  );
}
