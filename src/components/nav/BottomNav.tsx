"use client";

import * as React from "react";
import { Home, List, Scan, Settings } from "lucide-react";
import Link from "next/link";
import { cn } from "../ui/button";

const NAV_ITEMS = [
  { href: "/", label: "Colmenas", icon: Home, key: "hives" },
  { href: "/apiaries", label: "Explotaciones", icon: List, key: "apiaries" },
  { href: "/scan", label: "Escanear QR", icon: Scan, key: "scan" },
  { href: "/settings", label: "Ajustes", icon: Settings, key: "settings" },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-charcoal/20 bg-white/95 backdrop-blur-md px-4 pb-4 safe-bottom">
      <div className="max-w-[600px] mx-auto flex items-center justify-around gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 p-2 rounded-lg min-w-[48px] transition-colors",
                "text-charcoal/70 hover:text-teal-primary hover:bg-charcoal/10",
              )}
            >
              <Icon size={22} strokeWidth={2.5} />
              <span className="text-[10px] font-semibold leading-none text-charcoal/60">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
