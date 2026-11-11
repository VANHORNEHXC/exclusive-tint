import React from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: "blue" | "purple" | "amber" | "emerald";
}

export function GlowCard({
  children,
  className,
  glowColor = "amber",
  ...props
}: GlowCardProps) {
  const glowClasses = {
    blue: "hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    purple: "hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
    amber: "hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]",
    emerald: "hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-white/10 bg-zinc-950/80 p-6 backdrop-blur-md transition-all duration-300",
        glowClasses[glowColor],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
