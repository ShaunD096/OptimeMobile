"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Gauge, Plane, Compass, Smartphone } from "lucide-react";

export function MobileTabBar() {
  const pathname = usePathname();

  const tabs = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/optime", label: "FMS", icon: Gauge },
    { href: "/travel", label: "Travel", icon: Plane },
    { href: "/travel-optimizer", label: "Optimize", icon: Compass },
    { href: "/mobile", label: "Mobile", icon: Smartphone },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090d16]/90 backdrop-blur-2xl border-t border-white/[0.08] px-2 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-all select-none"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[52px] px-2 py-1 rounded-xl transition-all duration-150 active:scale-90 ${
                isActive
                  ? "text-cyan-400 font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <div
                className={`relative p-1.5 rounded-xl transition-all ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                    : "text-slate-400"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[10px] mt-1 tracking-tight ${
                  isActive ? "text-cyan-300 font-semibold" : "text-slate-400 font-medium"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
