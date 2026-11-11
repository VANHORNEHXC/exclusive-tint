import React from "react";
import { cn } from "@/lib/utils";

interface GradientHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "sm" | "lg" | "xl";
  weight?: "default" | "thin" | "base" | "semi" | "bold" | "black";
}

export function GradientHeading({
  children,
  className,
  size = "default",
  weight = "bold",
  ...props
}: GradientHeadingProps) {
  const sizeClasses = {
    sm: "text-2xl sm:text-3xl",
    default: "text-4xl sm:text-5xl md:text-6xl",
    lg: "text-5xl sm:text-6xl md:text-7xl",
    xl: "text-6xl sm:text-7xl md:text-8xl",
  };

  const weightClasses = {
    thin: "font-thin",
    base: "font-normal",
    semi: "font-semibold",
    default: "font-bold",
    bold: "font-bold",
    black: "font-black",
  };

  return (
    <h1
      className={cn(
        "tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500",
        sizeClasses[size],
        weightClasses[weight],
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}
