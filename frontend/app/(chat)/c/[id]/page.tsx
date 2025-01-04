import { Chat } from "@/components/chat";
import { api } from "@/lib/api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React, { FC } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page: FC<PageProps> = async ({ params }) => {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["messages", id],
    queryFn: () => api.getConversationMessages(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Chat conversationId={id} />
    </HydrationBoundary>
  );
};

export default Page;
