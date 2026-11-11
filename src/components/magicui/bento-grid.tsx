import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export function BentoGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-1 md:grid-cols-3 gap-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}: {
  name: string;
  className?: string;
  background?: ReactNode;
  Icon?: React.ElementType;
  description: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div
      className={cn(
        "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/60 p-6 transition-all duration-300 hover:border-white/20 hover:bg-zinc-900/80 backdrop-blur-md shadow-lg",
        className
      )}
    >
      <div className="absolute inset-0 pointer-events-none opacity-60 group-hover:opacity-80 transition-opacity">
        {background}
      </div>

      <div className="relative z-10 flex flex-col gap-2">
        {Icon && (
          <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-100 group-hover:scale-110 transition-transform">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <h3 className="text-xl font-bold tracking-tight text-white mt-2">
          {name}
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
      </div>

      <div className="relative z-10 mt-4 flex items-center gap-2">
        {cta && (
          <a
            href={href || "#"}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300 transition-colors group-hover:text-white"
          >
            {cta}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </a>
        )}
      </div>
    </div>
  );
}
