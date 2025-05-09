import { Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  // Removed dark mode functionality
  return (
    <Button variant="ghost" size="icon">
      <Sun className="h-5 w-5" />
      <span className="sr-only">Light mode</span>
    </Button>
  );
}
