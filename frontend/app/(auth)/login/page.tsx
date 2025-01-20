import React from "react";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { GoogleLoginButton } from "./_components/google-login-button";
import { SocialLoginButtons } from "./_components/social-login-buttons";

const Page = () => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center ">
        <CardTitle className="text-lg">Welcome</CardTitle>
        <CardDescription>
          Login or create an account with Google to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* <GoogleLoginButton /> */}
        <SocialLoginButtons />
      </CardContent>
    </Card>
  );
};

export default Page;
