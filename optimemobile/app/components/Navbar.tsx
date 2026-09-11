"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gauge, Plane, Compass, LayoutDashboard, LogIn, Smartphone } from "lucide-react";
import { MobileInstallModal } from "./MobileInstallModal";

export function Navbar() {
  const pathname = usePathname();
  const [isInstallOpen, setIsInstallOpen] = useState(false);

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/optime", label: "Financial Intelligence", icon: Gauge },
    { href: "/travel", label: "Travel", icon: Plane },
    { href: "/travel-optimizer", label: "Travel Optimizer", icon: Compass },
    { href: "/mobile", label: "Mobile Apps", icon: Smartphone },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#090d16]/80 border-b border-white/[0.08] pt-[env(safe-area-inset-top)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-6 lg:gap-8">
            <Link href="/" className="flex items-center gap-2.5 group active:scale-98 transition-transform">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-950/50 font-bold text-base sm:text-lg">
                Ω
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-base sm:text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  Atlas Go
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 px-1.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                  Optime
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-all ${
                      isActive
                        ? "bg-white/[0.08] text-cyan-300 border border-white/[0.08] shadow-sm"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsInstallOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 sm:py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 active:scale-95 text-cyan-300 border border-cyan-500/30 transition-all min-h-[36px]"
            >
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden xs:inline">App</span>
              <span className="xs:hidden">Get App</span>
            </button>

            <Link
              href="/login"
              className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/[0.08] px-3 py-2 sm:py-1.5 rounded-lg transition-all min-h-[36px]"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Sign in</span>
            </Link>
          </div>
        </div>
      </header>

      <MobileInstallModal
        isOpen={isInstallOpen}
        onClose={() => setIsInstallOpen(false)}
      />
    </>
  );
}
