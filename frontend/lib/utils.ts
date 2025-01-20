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
  const utcNow = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  const categorized: Record<string, Conversation[]> = {
    Today: [],
    "Previous 7 days": [],
    "Previous 30 days": [],
  };

  conversations.forEach((conversation) => {
    const createdAt = new Date(conversation.createdAt);
    const utcCreatedAt = new Date(
      Date.UTC(
        createdAt.getUTCFullYear(),
        createdAt.getUTCMonth(),
        createdAt.getUTCDate()
      )
    );
    const diffTime = utcNow.getTime() - utcCreatedAt.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      categorized["Today"].push(conversation);
    } else if (diffDays <= 7) {
      categorized["Previous 7 days"].push(conversation);
    } else if (diffDays <= 30) {
      categorized["Previous 30 days"].push(conversation);
    } else {
      const currentYear = utcNow.getUTCFullYear();
      const conversationYear = utcCreatedAt.getUTCFullYear();
      const conversationMonth = utcCreatedAt.getUTCMonth();

      let category: string;
      if (conversationYear === currentYear) {
        if (conversationMonth === 11 && utcNow.getUTCMonth() === 0) {
          category = currentYear.toString();
        } else {
          category = utcCreatedAt.toLocaleString("default", { month: "long" });
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

export const getBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    // Browser should use relative path
    return "";
  }

  if (process.env.VERCEL_URL) {
    // Reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    // Reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  }

  // Assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
};
