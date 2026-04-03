"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type NavPlatformItem = { readonly href: string; readonly label: string };

function navTriggerClass(active: boolean) {
  return [
    "inline-flex items-center gap-0.5 rounded-md px-1 py-2 text-sm font-normal transition-colors",
    active
      ? "text-primary underline decoration-primary/35 underline-offset-[6px]"
      : "text-secondary/90 hover:text-primary hover:underline hover:decoration-border hover:underline-offset-[6px]",
  ].join(" ");
}

export function NavPlatformDropdown({
  label,
  items,
  pathname,
  menuId,
}: {
  label: string;
  items: readonly NavPlatformItem[];
  pathname: string | null;
  menuId: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const platformActive = items.some(
    (i) =>
      pathname === i.href ||
      (pathname === "/panel-de-suscripcion-dashboard" && i.href === "/mesa-de-trabajo")
  );

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className={navTriggerClass(platformActive)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={menuId}
        id={`${menuId}-trigger`}
        onClick={() => setOpen((o) => !o)}
      >
        {label}
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 opacity-50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <div
          id={menuId}
          role="menu"
          aria-labelledby={`${menuId}-trigger`}
          className="absolute left-0 top-full z-50 mt-1.5 min-w-[13.5rem] rounded-xl border border-border/70 bg-background/90 py-1.5 shadow-lg backdrop-blur-xl backdrop-saturate-150"
        >
          {items.map((item) => {
            const active =
              pathname === item.href ||
              (pathname === "/panel-de-suscripcion-dashboard" && item.href === "/mesa-de-trabajo");
            return (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                className={`block px-4 py-2.5 text-sm font-normal transition-colors ${
                  active ? "bg-muted/60 text-primary" : "text-secondary/90 hover:bg-muted/50 hover:text-primary"
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
