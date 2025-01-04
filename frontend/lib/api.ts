import {
  Conversation,
  DBMessage,
  ErrorResponse,
  PaginatedResponse,
  SuccessResponse,
} from "@/types";
import { betterFetch } from "@better-fetch/fetch";

export const api = {
  getPaginatedConversations: async ({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }) => {
    const { data, error } = await betterFetch<
      PaginatedResponse<Conversation[]>,
      ErrorResponse
    >(`/api/chat/conversations?page=${page}&limit=${limit}`, {
      method: "GET",
      baseURL: process.env.NEXT_PUBLIC_API_URL!,
      credentials: "include",
    });

    if (error) {
      throw new Error(error.error);
    }

    return data;
  },
  updateConversation: async ({ id, title }: { id: string; title: string }) => {
    const { data, error } = await betterFetch<
      SuccessResponse<Conversation>,
      ErrorResponse
    >(`/api/chat/conversations/${id}`, {
      method: "PATCH",
      body: { title },
      baseURL: process.env.NEXT_PUBLIC_API_URL!,
      credentials: "include",
    });

    if (error) {
      throw new Error(error.error);
    }

    return data;
  },
  deleteConversation: async (id: string) => {
    const { data, error } = await betterFetch<
      SuccessResponse<Conversation>,
      ErrorResponse
    >(`/api/chat/conversations/${id}`, {
      method: "DELETE",
      baseURL: process.env.NEXT_PUBLIC_API_URL!,
      credentials: "include",
    });

    if (error) {
      throw new Error(error.error);
    }

    return data;
  },
  getConversationMessages: async (id: string) => {
    const { data, error } = await betterFetch<
      SuccessResponse<DBMessage[]>,
      ErrorResponse
    >(`/api/chat/conversations/${id}/messages`, {
      method: "GET",
      baseURL: process.env.NEXT_PUBLIC_API_URL!,
      credentials: "include",
    });

    if (error) {
      throw new Error(error.error);
    }

    return data;
  },
};
