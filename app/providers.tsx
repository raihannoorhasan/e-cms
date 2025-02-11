"use client";

import { ThemeProvider } from "next-themes";
import { CMSProvider } from "@/lib/store/cms-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <CMSProvider>
        {children}
      </CMSProvider>
    </ThemeProvider>
  );
}