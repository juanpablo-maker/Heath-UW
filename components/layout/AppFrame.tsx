"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { isFullBleedPath } from "@/lib/layout-paths";

export function AppFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const fullBleed = isFullBleedPath(pathname);

  return (
    <>
      <Header />
      <main
        className={
          fullBleed ? "min-h-screen" : "min-h-screen pt-[3.75rem] md:pt-16"
        }
      >
        {children}
      </main>
    </>
  );
}
