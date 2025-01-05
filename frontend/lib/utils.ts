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
  // Check if we're in a browser environment
  if (typeof window !== "undefined") {
    return ""; // Empty string for client-side as we use relative URLs
  }

  // For development environment
  if (process.env.NODE_ENV === "development") {
    return `http://localhost:${process.env.PORT || 3000}`;
  }

  // For production environment
  // First check for VERCEL_URL which is provided by Vercel
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Then check for custom domain set in environment variables
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  // Fallback to localhost if nothing else is setx
  return `http://localhost:${process.env.PORT || 3000}`;
};
