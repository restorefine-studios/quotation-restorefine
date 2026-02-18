"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="relative flex flex-col items-center justify-center h-screen w-screen bg-black text-white gap-6 overflow-hidden">
        {/* Simplified background effects — reduced from 5 blur layers to 2 for mobile GPU performance */}
        <div className="absolute inset-0 bg-gradient-radial from-red-400/15 via-transparent to-transparent" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-red-500/10 rounded-full blur-[80px] animate-pulse-slow" />

        {/* Content */}
        <div className="relative z-10">
          <Image src="/r-logo.png" alt="RestoRefine Logo" width={64} height={64} className="shadow-2xl animate-bounce" />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-2">
          <p className="text-sm font-black uppercase tracking-[0.4em] text-red-500">RestoRefine</p>
          <div className="flex items-center gap-2 text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs font-bold italic">Authenticating...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
