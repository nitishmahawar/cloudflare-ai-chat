import React from "react";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { GoogleLoginButton } from "./_components/google-login-button";
import { SignInForm } from "./_components/sign-in-form";

const Page = () => {
  return (
    // <Card>
    //   <CardHeader className="text-center">
    //     <CardTitle className="text-xl">Welcome</CardTitle>
    //     <CardDescription>
    //       Sign in or create an account with Google to continue
    //     </CardDescription>
    //   </CardHeader>
    //   <CardContent>
    //     <GoogleLoginButton />
    //   </CardContent>
    // </Card>
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center ">
        <CardTitle className="text-lg">Sign In</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm />
      </CardContent>
    </Card>
  );
};

export default Page;
