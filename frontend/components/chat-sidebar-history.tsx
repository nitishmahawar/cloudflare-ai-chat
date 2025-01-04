"use client";
import React, { useMemo, useRef, useEffect } from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarMenuSkeleton,
} from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRenameConversationDialog } from "@/hooks/use-remane-conversation-dialog";
import { useDeleteConversationDialog } from "@/hooks/use-delete-conversation-dialog";
import { Conversation } from "@/types";
import { categorizeConversations } from "@/lib/utils";
import { SidebarHistorySkeleton } from "./sidebar-history-skeleton";
import { Spinner } from "./spinner";

export const ChatSidebarHistory = () => {
  const targetRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["conversations"],
      initialPageParam: 1,
      queryFn: ({ pageParam }) =>
        api.getPaginatedConversations({ page: pageParam, limit: 20 }),

      getNextPageParam: (lastpage, pages, lastpageParam) => {
        return lastpageParam < lastpage.pagination.totalPages
          ? lastpageParam + 1
          : undefined;
      },
    });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const conversations = data?.pages.flatMap((page) => page.data) || [];

  const groupedConversations = useMemo(
    () => categorizeConversations(conversations),
    [conversations]
  );

  if (isLoading) {
    return <SidebarHistorySkeleton />;
  }

  return (
    <>
      {Object.keys(groupedConversations).map((key) => (
        <SidebarGroup
          key={key}
          className="group-data-[collapsible=icon]:hidden"
        >
          <SidebarGroupLabel>{key}</SidebarGroupLabel>
          <SidebarMenu>
            {groupedConversations[key].map((conversation) => (
              <SidebarHistoryItem
                key={conversation.id}
                conversation={conversation}
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
      <div ref={targetRef} className="min-h-1">
        {isFetchingNextPage && <Spinner />}
      </div>
      {/* {isFetchingNextPage && <SidebarMenuSkeleton />} */}
    </>
  );
};

const SidebarHistoryItem = ({
  conversation,
}: {
  conversation: Conversation;
}) => {
  const { id } = useParams();
  const { isMobile } = useSidebar();
  const { setConversation: renameConversation } = useRenameConversationDialog();
  const { setConversation: deleteConversation } = useDeleteConversationDialog();

  return (
    <SidebarMenuItem key={conversation.id}>
      <SidebarMenuButton asChild isActive={conversation.id === id}>
        <Link href={`/c/${conversation.id}`}>
          <span>{conversation.title}</span>
        </Link>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction showOnHover>
            <MoreHorizontal />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-40 rounded-lg"
          side={isMobile ? "bottom" : "right"}
          align={isMobile ? "end" : "start"}
        >
          <DropdownMenuItem onClick={() => renameConversation(conversation)}>
            <Edit2 className="text-muted-foreground" />
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => deleteConversation(conversation)}>
            <Trash2 className="text-muted-foreground" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};
