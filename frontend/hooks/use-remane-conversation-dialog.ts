import { Conversation } from "@/types";
import { create } from "zustand";

interface RenameDialogStore {
  conversation: Conversation | null;
  setConversation: (value: Conversation | null) => void;
}

export const useRenameConversationDialog = create<RenameDialogStore>((set) => ({
  conversation: null,
  setConversation(value) {
    set({ conversation: value });
  },
}));
