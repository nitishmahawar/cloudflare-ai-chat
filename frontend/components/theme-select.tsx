import { useTheme } from "next-themes";
import React from "react";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "./ui/select";
import { Laptop, Moon, Sun } from "lucide-react";

export const ThemeSelect = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Select value={theme} onValueChange={setTheme}>
      <SelectTrigger className="border-none shadow-none">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">
          <div className="flex items-center gap-2">
            <Sun size={16} className="text-muted-foreground" /> Light
          </div>
        </SelectItem>
        <SelectItem value="dark">
          <div className="flex items-center gap-2">
            <Moon size={16} className="text-muted-foreground" /> Dark
          </div>
        </SelectItem>
        <SelectItem value="system">
          <div className="flex items-center gap-2">
            <Laptop size={16} className="text-muted-foreground" /> System
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
