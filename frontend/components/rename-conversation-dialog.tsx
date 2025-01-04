"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useRenameConversationDialog } from "@/hooks/use-remane-conversation-dialog";
import { Spinner } from "./spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  title: z
    .string()
    .min(10, { message: "Title must be 10 character long" })
    .max(200, { message: "Title must be less than 200 characters" }),
});

export const RenameConversationDialog = () => {
  const { conversation, setConversation } = useRenameConversationDialog();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      title: "",
    },
    resolver: zodResolver(formSchema),
  });

  React.useEffect(() => {
    if (conversation?.title) {
      form.setValue("title", conversation.title);
    }
  }, [conversation, form]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["rename conversation"],
    mutationFn: api.updateConversation,
    onSuccess() {
      setConversation(null);
      form.reset();
    },
    onError(error) {
      toast.error(error.message);
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!conversation) return;
    mutate({ id: conversation.id, title: values.title });
  };

  const isOpen = !!conversation;

  const onOpenChange = (value: boolean) => {
    !value && setConversation(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Conversation</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter conversation title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending && <Spinner />} Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
