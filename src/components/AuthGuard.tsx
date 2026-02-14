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
        {/* Enhanced red blur effect with particle movement */}
        <div className="absolute inset-0 bg-gradient-radial from-red-400/20 via-red-500/5 to-transparent blur-[120px]" />

        {/* Animated floating particles */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-500/15 rounded-full blur-[150px] animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-red-500/15 rounded-full blur-[150px] animate-float-slower" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[130px] -translate-x-1/2 -translate-y-1/2 animate-pulse-slow" />

        {/* Additional subtle particles */}
        <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] bg-red-500/8 rounded-full blur-[120px] animate-float-reverse" />
        <div className="absolute bottom-1/3 left-1/3 w-[350px] h-[350px] bg-red-500/8 rounded-full blur-[140px] animate-float-diagonal" />

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
