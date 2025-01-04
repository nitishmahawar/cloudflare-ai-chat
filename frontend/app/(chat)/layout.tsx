import { ChatSidebar } from "@/components/chat-sidebar";
import { Navbar } from "@/components/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { api } from "@/lib/api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

const ChatLayout = async ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["conversations"],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      api.getPaginatedConversations({ page: pageParam, limit: 20 }),
  });

  return (
    <SidebarProvider>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ChatSidebar />
      </HydrationBoundary>
      <div className="w-full">
        <Navbar />
        {children}
      </div>
    </SidebarProvider>
  );
};

export default ChatLayout;
