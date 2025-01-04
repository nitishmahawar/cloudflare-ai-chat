"use client";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import React, { useState } from "react";
import { toast } from "sonner";

export const GoogleLoginButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    const data = await authClient.signIn.social(
      {
        provider: "google",
        callbackURL: "http://localhost:3000",
        newUserCallbackURL: "http://localhost:3000",
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onError: (context) => {
          toast.error(context.error.message);
        },
        onResponse: () => {
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <Button className="w-full" disabled={isLoading} onClick={handleClick}>
      {isLoading && <Spinner />}
      Continue With Google
    </Button>
  );
};
