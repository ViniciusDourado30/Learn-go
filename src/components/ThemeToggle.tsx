import React from "react";
import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { Button } from "../components/ui/nextui-shim";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      isIconOnly
      variant="light"
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className="text-slate-500 dark:text-slate-400"
    >
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </Button>
  );
};