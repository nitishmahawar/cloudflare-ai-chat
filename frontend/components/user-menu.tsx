"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import {
  Bolt,
  BookOpen,
  CircleUserRound,
  Layers2,
  LogOut,
  Pin,
  UserPen,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useMounted } from "@/hooks/use-mounted";
import { Skeleton } from "./ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useRouter } from "next/navigation";
import { ThemeSelect } from "./theme-select";

export const UserMenu = () => {
  const mounted = useMounted();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const logout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  const getAvatarFallback = () => {
    return session?.user
      ? session.user.name.toUpperCase().split(" ")[0][0] +
          session.user.name.toUpperCase().split(" ")[1][0]
      : "";
  };

  if (!mounted || isPending) {
    return <Skeleton className="size-10 rounded-full" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="size-9">
          <AvatarImage src={session?.user.image || undefined} />
          <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64" align="end">
        <DropdownMenuLabel className="flex items-start gap-3">
          <Avatar className="size-8">
            <AvatarImage src={session?.user.image || undefined} />
            <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-foreground">
              {session?.user.name}
            </span>
            <span className="truncate text-xs font-normal text-muted-foreground">
              {session?.user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ThemeSelect />
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut
            size={16}
            strokeWidth={2}
            className="text-muted-foreground"
            aria-hidden="true"
          />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
