"use client";
import React from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "./ui/sidebar";
import { Skeleton } from "./ui/skeleton";
import { useMounted } from "@/hooks/use-mounted";

export const SidebarHistorySkeleton = () => {
  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>
        <Skeleton className="h-4 w-16" />
      </SidebarGroupLabel>
      <SidebarMenu>
        {Array.from({ length: 10 }).map((_, i) => (
          <SidebarMenuItem key={i}>
            <SidebarMenuSkeleton />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};
