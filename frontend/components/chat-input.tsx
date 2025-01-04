import { useChat } from "ai/react";
import React, { FC, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "./ui/button";
import { ArrowUp, Pause } from "lucide-react";

interface ChatInputProps {
  input: string;
  handleInputChange: ReturnType<typeof useChat>["handleInputChange"];
  handleSubmit: ReturnType<typeof useChat>["handleSubmit"];
  isLoading: boolean;
  stop: ReturnType<typeof useChat>["stop"];
  setStreaming: (value: boolean) => void;
}

export const ChatInput: FC<ChatInputProps> = ({
  handleInputChange,
  handleSubmit,
  input,
  isLoading,
  stop,
  setStreaming,
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      className="w-full max-w-3xl mx-auto border shadow-sm rounded-3xl overflow-hidden bg-accent focus-within:shadow"
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <TextareaAutosize
        className="flex w-full p-4 ring-offset-background bg-accent placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 whitespace-break-spaces resize-none"
        placeholder="Ask anything..."
        autoFocus
        value={input}
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevent default to avoid newline
            handleSubmit(e);
            setStreaming(true);
          }
        }}
        minRows={1}
        rows={1}
        maxRows={7}
      />
      <div className="flex p-2.5 pt-0 justify-end">
        {isLoading ? (
          <Button
            type="button"
            size="icon"
            onClick={stop}
            className="rounded-full [&_svg]:size-5"
          >
            <Pause
              size={18}
              className="fill-background text-foreground"
              strokeWidth={0}
            />
          </Button>
        ) : (
          <Button
            disabled={input.length === 0}
            type="submit"
            size="icon"
            className="rounded-full [&_svg]:size-5"
          >
            <ArrowUp />
          </Button>
        )}
      </div>
    </form>
  );
};
