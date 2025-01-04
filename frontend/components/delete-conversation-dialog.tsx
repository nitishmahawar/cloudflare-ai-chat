"use client";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Spinner } from "./spinner";
import { useDeleteConversationDialog } from "@/hooks/use-delete-conversation-dialog";

export const DeleteConversationDialog = () => {
  const { conversation, setConversation } = useDeleteConversationDialog();
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["delete conversation"],
    mutationFn: api.deleteConversation,
    onSuccess(data, variables, context) {
      if (id === variables) {
        router.replace("/");
      }
      setConversation(null);
    },
    onError(error, variables, context) {
      toast.error(error.message);
    },
    onSettled(data, error, variables, context) {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
  const isOpen = !!conversation;

  const onOpenChange = (value: boolean) => {
    !value && setConversation(null);
  };

  const deleteConversation = () => {
    conversation && mutate(conversation.id);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            conversation.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {/* <AlertDialogAction>Continue</AlertDialogAction> */}
          <Button disabled={isPending} onClick={deleteConversation}>
            {isPending && <Spinner />} Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
