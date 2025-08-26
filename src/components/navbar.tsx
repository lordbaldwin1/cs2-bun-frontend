"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export function Navbar() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className="border-border/20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 flex items-center justify-center rounded-lg p-2 border border-primary/20">
                <Link href={"/"}>
                  <span className="text-primary text-sm font-medium">
                    cs-bun
                  </span>
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <Link 
                href={"/"} 
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link 
                href={"/players"} 
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                Players
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <span className="text-muted-foreground text-sm font-medium hidden md:block">
              Player Performance Analysis
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 rounded-lg border border-border/20 hover:bg-muted/50 transition-all"
            >
              <Sun className="h-[1.1rem] w-[1.1rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.1rem] w-[1.1rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
