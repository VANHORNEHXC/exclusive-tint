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
        "relative flex flex-col justify-between rounded-3xl border p-8 transition-all duration-300 backdrop-blur-md",
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
        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
        <p className="text-xs text-zinc-400 mt-1 min-h-[32px]">{plan.tagline}</p>

        <div className="mt-6 flex items-baseline gap-1">
          <span className="text-4xl font-extrabold tracking-tight text-white">
            {plan.price}
          </span>
          <span className="text-xs text-zinc-400">{t("pricing.installation")}</span>
        </div>

        <ul className="mt-8 space-y-3 border-t border-white/10 pt-6">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-zinc-300">
              <div className="rounded-full bg-emerald-500/10 p-1 text-emerald-400 mt-0.5">
                <Check className="h-3.5 w-3.5" />
              </div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 pt-4">
        <a
          href={plan.ctaHref}
          className={cn(
            "flex w-full items-center justify-center rounded-xl py-3 text-sm font-bold transition-all",
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
