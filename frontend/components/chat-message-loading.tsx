import { Sparkles } from "lucide-react";
import React from "react";
import { TextShimmer } from "./ui/text-shimmer";

export const ChatMessageLoading = () => {
  return (
    <div className="group relative flex items-start px-4 py-2.5 rounded-2xl">
      <div className="border rounded-full size-9 mr-4 flex items-center justify-center">
        <Sparkles size={16} className="fill-foreground" />
      </div>

      <div className="">
        <TextShimmer>Thinking...</TextShimmer>
      </div>
    </div>
  );
};
