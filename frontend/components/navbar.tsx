import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserMenu } from "./user-menu";

export const Navbar = () => {
  return (
    <nav className="h-14 flex justify-between items-center px-4 sm:px-6">
      <SidebarTrigger />

      <UserMenu />
    </nav>
  );
};
