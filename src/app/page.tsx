'use client';

import {
  Shield,
  Sun,
  Flame,
  Sparkles,
  Car,
  Clock,
  ArrowRight,
  PhoneCall,
  Award,
  Layers,
} from "lucide-react";

// Magic UI Components
import { Particles } from "@/components/magicui/particles";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { BorderBeam } from "@/components/magicui/border-beam";
import { BentoGrid, BentoCard } from "@/components/magicui/bento-grid";
import { Marquee } from "@/components/magicui/marquee";

// Cult UI Components
import { Spotlight } from "@/components/cultui/spotlight";
import { GradientHeading } from "@/components/cultui/gradient-heading";
import { GlowCard } from "@/components/cultui/glow-card";

// Skiper UI Components
import { TintSimulator } from "@/components/skiperui/tint-simulator";
import { ComparisonSlider } from "@/components/skiperui/comparison-slider";
import { PricingCard, PricingPlan } from "@/components/skiperui/pricing-card";
import { ReviewsSection } from "@/components/skiperui/reviews-section";

import { useLocale } from '@/context/LocaleContext';
import { useEffect, type MouseEvent } from 'react';
import Link from 'next/link';
import { whatsappUrl } from '@/lib/contact';

export default function Home() {
  const { t, image, locale } = useLocale();
  useEffect(() => { void fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event: "page_view" }), keepalive: true }).catch(() => {}); }, []);
  function trackWhatsApp(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    if (target.closest('a[href*="wa.me"]')) void fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event: "whatsapp_click" }), keepalive: true }).catch(() => {});
  }
  const brands = t("marquee.brands").split(",").map((brand) => brand.trim()).filter(Boolean);
  const plans: PricingPlan[] = ([{ id: "carbon", count: 5 }, { id: "ceramic", count: 6 }, { id: "ppf", count: 5 }] as const).map(({ id, count }) => ({
    id, name: t(`plan.${id}.name`), tagline: t(`plan.${id}.tagline`), price: t(`plan.${id}.price`),
    popular: id === "ceramic", features: Array.from({ length: count }, (_, index) => t(`plan.${id}.feature${index + 1}`)),
    cta: t(`plan.${id}.cta`), ctaHref: whatsappUrl(`${t("whatsapp.message.quote")}: ${t(`plan.${id}.name`)}`),
  }));
  function serviceImage(slot: string, fallback: string) {
    const uploaded = image(slot);
    return <div role={uploaded ? "img" : undefined} aria-label={uploaded ? uploaded[locale === "es" ? "alt_es" : "alt_en"] : undefined} className={`absolute inset-0 ${fallback}`} style={uploaded ? { backgroundImage: `linear-gradient(to top, rgba(0,0,0,.78), rgba(0,0,0,.48)), url("${uploaded.url}")`, backgroundSize: "cover", backgroundPosition: "center" } : undefined} />;
  }
  return (
    <div onClick={trackWhatsApp} className="relative min-h-screen bg-black text-white selection:bg-amber-500 selection:text-black overflow-x-hidden">
      {/* Dynamic Background Particles (Magic UI) */}
      <Particles quantity={45} color="#f59e0b" className="opacity-40" />

      {/* Ambient Spotlight (Cult UI) */}
      <Spotlight fill="rgba(245, 158, 11, 0.12)" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-black font-black text-base shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              ET
            </div>
            <div>
              <span className="text-xl font-black tracking-widest text-white">{t("brand.name")}</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
            <a href="#simulador" className="hover:text-amber-400 transition-colors">{t('nav.simulador')}</a>
            <a href="#servicios" className="hover:text-amber-400 transition-colors">{t('nav.servicios')}</a>
            <a href="#comparativa" className="hover:text-amber-400 transition-colors">{t('nav.tecnologia')}</a>
            <a href="#precios" className="hover:text-amber-400 transition-colors">{t('nav.precios')}</a>
            <a href="#opiniones" className="hover:text-amber-400 transition-colors">{t('nav.opiniones')}</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={whatsappUrl(t("whatsapp.message.quote"))}
              target="_blank"
              rel="noreferrer"
            >
              <ShimmerButton shimmerColor="#fbbf24" className="px-4 py-2 text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <PhoneCall className="h-3.5 w-3.5 text-amber-400" /> {t('whatsapp.cta')}
                </span>
              </ShimmerButton>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto text-center flex flex-col items-center" style={image("hero") ? { backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,.72), rgba(0,0,0,.55) 55%, #000), url("${image("hero")?.url}")`, backgroundSize: "cover", backgroundPosition: "center 55%" } : undefined}>
        {/* WhatsApp contact badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-300 mb-8 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{t('badge.bot')}</span>
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-400">{t('badge.cotizaciones')}</span>
        </div>

        <GradientHeading size="xl" className="max-w-4xl mx-auto leading-none">
          {t('hero.heading')}
        </GradientHeading>

        <p className="mt-6 text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          {t('hero.sub')}
        </p>

        {/* CTA Buttons with Magic UI & Border Beam */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <a
            href={whatsappUrl(t("whatsapp.message.book"))}
            target="_blank"
            rel="noreferrer"
          >
            <ShimmerButton shimmerColor="#f59e0b" className="px-8 py-4 text-base font-bold shadow-2xl">
              <span className="flex items-center gap-2">
                {t('cta.agendar')} <ArrowRight className="h-4 w-4" />
              </span>
            </ShimmerButton>
          </a>

          <a
            href="#simulador"
            className="flex items-center gap-2 px-6 py-4 rounded-full border border-white/15 bg-white/5 text-sm font-bold text-zinc-200 hover:bg-white/10 hover:text-white transition-all backdrop-blur"
          >
            <Sun className="h-4 w-4 text-amber-400" /> {t('cta.probar')}
          </a>
        </div>

        {/* Quick Trust Highlights */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl border-t border-white/10 pt-8 text-left">
          <div className="flex items-center gap-3">
            <Award className="h-8 w-8 text-amber-400 shrink-0" />
            <div>
              <div className="text-sm font-bold text-white">{t('trust.garantia')}</div>
              <div className="text-xs text-zinc-500">{t('trust.garantiaDesc')}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Flame className="h-8 w-8 text-amber-400 shrink-0" />
            <div>
              <div className="text-sm font-bold text-white">{t('trust.calor')}</div>
              <div className="text-xs text-zinc-500">{t('trust.calorDesc')}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Car className="h-8 w-8 text-amber-400 shrink-0" />
            <div>
              <div className="text-sm font-bold text-white">{t('trust.precision')}</div>
              <div className="text-xs text-zinc-500">{t('trust.precisionDesc')}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-amber-400 shrink-0" />
            <div>
              <div className="text-sm font-bold text-white">{t('trust.tiempo')}</div>
              <div className="text-xs text-zinc-500">{t('trust.tiempoDesc')}</div>
            </div>
          </div>
        </div>

        {/* Vehicle Brands Marquee (Magic UI) */}
        <div className="mt-14 w-full max-w-5xl overflow-hidden py-4 border-y border-white/5">
          <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-3 text-center">
            {t('marquee.title')}
          </div>
          <Marquee pauseOnHover className="[--duration:25s]">
            {brands.map((brand) => (
              <span key={brand} className="mx-4 text-sm font-black tracking-widest text-zinc-400 hover:text-amber-400 transition-colors">
                {brand}
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* Interactive Tint Simulator (Skiper UI) */}
      <section id="simulador" className="py-20 px-6 max-w-7xl mx-auto scroll-mt-24">
        <TintSimulator />
      </section>

      {/* Before / After Thermal Comparison Slider (Skiper UI) */}
      <section id="comparativa" className="py-20 px-6 max-w-5xl mx-auto scroll-mt-24 text-center">
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">{t("compare.eyebrow")}</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">{t("compare.heading")}</h2>
          <p className="text-sm text-zinc-400 mt-2">{t("compare.intro")}</p>
        </div>
        <ComparisonSlider />
      </section>

      {/* Services Bento Grid (Magic UI) */}
      <section id="servicios" className="py-20 px-6 max-w-7xl mx-auto scroll-mt-24">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">{t("services.eyebrow")}</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">{t("services.heading")}</h2>
        </div>
        <BentoGrid>
          <BentoCard
            name={t("service.tint.name")}
            description={t("service.tint.description")}
            Icon={Sun}
            cta={t("service.tint.cta")}
            href="#simulador"
            className="md:col-span-2"
            background={serviceImage("service_tint", "bg-gradient-to-tr from-amber-950/30 via-zinc-900 to-black")}
          />
          <BentoCard
            name={t("service.ppf.name")}
            description={t("service.ppf.description")}
            Icon={Shield}
            cta={t("service.ppf.cta")}
            href={whatsappUrl("Cotizar PPF")}
            className="md:col-span-1"
            background={serviceImage("service_ppf", "bg-gradient-to-br from-zinc-900 to-black")}
          />
          <BentoCard
            name={t("service.coating.name")}
            description={t("service.coating.description")}
            Icon={Sparkles}
            cta={t("service.coating.cta")}
            href={whatsappUrl("Cotizar Ceramic Coating")}
            className="md:col-span-1"
            background={serviceImage("service_coating", "bg-gradient-to-br from-zinc-900 to-black")}
          />
          <BentoCard
            name={t("service.cut.name")}
            description={t("service.cut.description")}
            Icon={Layers}
            cta={t("service.cut.cta")}
            href="#simulador"
            className="md:col-span-2"
            background={serviceImage("service_cut", "bg-gradient-to-br from-zinc-900 via-zinc-950 to-black")}
          />
          <BentoCard
            name={t("service.wrap.name")}
            description={t("service.wrap.description")}
            Icon={Car}
            cta={t("service.wrap.cta")}
            href={whatsappUrl(`${t("whatsapp.message.quote")}: Vinyl Wrap`)}
            className="md:col-span-3"
            background={serviceImage("service_wrap", "bg-gradient-to-br from-zinc-900 via-zinc-950 to-black")}
          />
        </BentoGrid>
        <p className="mt-4 text-center text-xs text-zinc-500">{t("services.photoNote")}</p>
      </section>

      {/* Pricing Packages (Skiper UI) */}
      <section id="precios" className="py-20 px-6 max-w-7xl mx-auto scroll-mt-24">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">{t("pricing.eyebrow")}</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">{t("pricing.heading")}</h2>
          <p className="text-sm text-zinc-400 mt-2">{t("pricing.intro")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Vehicle Brands Marquee (Magic UI) */}
        <div className="mt-14 w-full max-w-5xl overflow-hidden py-4 border-y border-white/5">
          <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-3 text-center">
            {t('marquee.title')}
          </div>
          <Marquee pauseOnHover className="[--duration:25s]">
            {brands.map((brand) => (
              <span key={brand} className="mx-4 text-sm font-black tracking-widest text-zinc-400 hover:text-amber-400 transition-colors">
                {brand}
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* Customer reviews */}
      <ReviewsSection />

      {/* WhatsApp contact banner */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <GlowCard glowColor="amber" className="p-8 sm:p-12 relative overflow-hidden">
          <BorderBeam size={300} duration={12} colorFrom="#f59e0b" colorTo="#eab308" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> {t('badge.bot')}
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">{t('banner.title')}</h3>
              <p className="text-sm text-zinc-400 max-w-lg">{t('banner.sub')}</p>
            </div>

            <a
              href={whatsappUrl(t("whatsapp.message.banner"))}
              target="_blank"
              rel="noreferrer"
              className="shrink-0"
            >
              <ShimmerButton shimmerColor="#ffffff" className="px-6 py-3.5 text-sm font-bold bg-amber-500 text-black">
                {t('banner.cta')}
              </ShimmerButton>
            </a>
          </div>
        </GlowCard>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-zinc-950 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-zinc-500">
          <div className="flex items-center gap-2 text-zinc-300 font-bold">
            <span>{t("brand.name")}</span>
            <span>•</span>
            <span>{t("brand.tagline")}</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#simulador" className="hover:text-white transition-colors">{t('nav.simulador')}</a>
            <a href="#servicios" className="hover:text-white transition-colors">{t('nav.servicios')}</a>
          </div>

          <p>{t('footer.copy')}</p>
        </div>
      </footer>
    </div>
  );
}
