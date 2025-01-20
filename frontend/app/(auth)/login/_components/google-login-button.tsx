"use client";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { getBaseUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export const GoogleLoginButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    await authClient.signIn.social(
      {
        provider: "google",
        callbackURL: getBaseUrl(),
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
        onSuccess: () => {
          router.push("/");
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
