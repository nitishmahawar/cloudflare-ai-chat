import { Conversation } from "@/types";
import { create } from "zustand";

interface DeleteDialogStore {
  conversation: Conversation | null;
  setConversation: (value: Conversation | null) => void;
}

export const useDeleteConversationDialog = create<DeleteDialogStore>((set) => ({
  conversation: null,
  setConversation(value) {
    set({ conversation: value });
  },
}));
