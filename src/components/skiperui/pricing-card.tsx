import React from "react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/context/LocaleContext";
import { Check, Sparkles } from "lucide-react";

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  price: string;
  popular?: boolean;
  features: string[];
  cta: string;
  ctaHref: string;
}

export function PricingCard({
  plan,
  className,
}: {
  plan: PricingPlan;
  className?: string;
}) {
  const { t } = useLocale();
  return (
    <div
      className={cn(
        "relative flex min-w-0 flex-col justify-between rounded-2xl border p-3.5 transition-all duration-300 backdrop-blur-md sm:p-6 md:rounded-3xl md:p-8",
        plan.popular
          ? "border-amber-500/50 bg-gradient-to-b from-amber-950/20 via-zinc-950 to-zinc-950 shadow-[0_0_40px_rgba(245,158,11,0.15)]"
          : "border-white/10 bg-zinc-950/60 hover:border-white/20",
        className
      )}
    >
      {plan.popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1 text-[11px] font-black uppercase text-black shadow-lg flex items-center gap-1">
          <Sparkles className="h-3 w-3" /> {t("pricing.recommended")}
        </div>
      )}

      <div>
        <h3 className="text-sm font-bold leading-tight text-white sm:text-lg md:text-xl">{plan.name}</h3>
        <p className="mt-1 text-[11px] leading-snug text-zinc-400 md:min-h-[32px] md:text-xs">{plan.tagline}</p>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-1 md:mt-6">
          <span className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl">
            {plan.price}
          </span>
          <span className="text-[10px] text-zinc-400 md:text-xs">{t("pricing.installation")}</span>
        </div>

        <ul className="mt-4 space-y-2 border-t border-white/10 pt-3 md:mt-8 md:space-y-3 md:pt-6">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-1.5 text-[11px] leading-snug text-zinc-300 md:gap-3 md:text-sm">
              <div className="mt-0.5 shrink-0 rounded-full bg-emerald-500/10 p-0.5 text-emerald-400 md:p-1">
                <Check className="h-3 w-3 md:h-3.5 md:w-3.5" />
              </div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 pt-2 md:mt-8 md:pt-4">
        <a
          href={plan.ctaHref}
          className={cn(
            "flex w-full items-center justify-center rounded-xl px-1 py-2 text-center text-[11px] font-bold leading-tight transition-all md:py-3 md:text-sm",
            plan.popular
              ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:opacity-90 shadow-lg shadow-amber-500/20"
              : "border border-white/15 bg-white/5 text-white hover:bg-white/10"
          )}
        >
          {plan.cta}
        </a>
      </div>
    </div>
  );
}
