import React from "react";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

export const MessagesSkeleton = () => {
  return (
    <div className="flex-1 w-full max-w-3xl mx-auto space-y-4">
      <Skeleton className="h-12 rounded-2xl max-w-sm ml-auto" />
      <div className="flex gap-4">
        <Skeleton className="size-9 rounded-full" />
        <div className="w-full space-y-1.5">
          {["max-w-lg", "max-w-md", "max-w-lg"].map((className, i) => (
            <Skeleton key={i} className={cn("h-4", className)} />
          ))}
        </div>
      </div>
      <Skeleton className="h-12 rounded-2xl max-w-xs ml-auto" />
      <div className="flex gap-4">
        <Skeleton className="size-9 rounded-full" />
        <div className="w-full space-y-1.5">
          {["max-w-md", "max-w-sm", "max-w-xs"].map((className, i) => (
            <Skeleton key={i} className={cn("h-4", className)} />
          ))}
        </div>
      </div>
    </div>
  );
};
