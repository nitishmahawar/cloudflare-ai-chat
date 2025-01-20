"use client";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { getBaseUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export const SocialLoginButtons = () => {
  const [loading, setLoading] = useState<null | "google" | "github">(null);

  const router = useRouter();

  const signIn = async (provider: "google" | "github") => {
    await authClient.signIn.social(
      {
        provider,
        callbackURL: getBaseUrl(),
      },
      {
        onRequest: () => {
          setLoading(provider);
        },
        onError: (context) => {
          toast.error(context.error.message);
        },
        onResponse: () => {
          setLoading(null);
        },
        onSuccess: () => {
          router.push("/");
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-2.5">
      <Button
        className="w-full"
        disabled={!!loading}
        onClick={() => signIn("google")}
      >
        {loading === "google" && <Spinner />}
        Continue With Google
      </Button>
      <Button
        className="w-full"
        disabled={!!loading}
        onClick={() => signIn("github")}
      >
        {loading === "github" && <Spinner />}
        Continue With Github
      </Button>
    </div>
  );
};
