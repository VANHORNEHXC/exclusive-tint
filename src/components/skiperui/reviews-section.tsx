"use client";

import React, { useEffect, useState } from "react";
import { Star, ShieldCheck, ThumbsUp, Car } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

interface PublicReview {
  id: string;
  client_name: string;
  rating: number;
  comment: string;
  vehicle_info: string | null;
  service_rendered: string | null;
  is_verified: boolean;
  likes: number;
}

export function ReviewsSection() {
  const { t } = useLocale();
  const [reviews, setReviews] = useState<PublicReview[] | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/reviews", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Reviews unavailable");
        return response.json() as Promise<{ reviews: PublicReview[] }>;
      })
      .then((data) => setReviews(data.reviews))
      .catch(() => {
        if (!controller.signal.aborted) setReviews([]);
      });
    return () => controller.abort();
  }, []);

  return (
    <section id="opiniones" className="py-20 px-6 max-w-7xl mx-auto scroll-mt-24">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 mb-2">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {t("reviews.badge")}
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          {t("reviews.heading")}
        </h2>
        <p className="text-sm text-zinc-400 mt-2 max-w-xl mx-auto">
          {reviews === null ? t("reviews.loading") : reviews.length > 0 ? t("reviews.intro") : t("reviews.empty")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews?.map((rev) => (
          <div
            key={rev.id}
            className="flex flex-col justify-between rounded-3xl border border-white/10 bg-zinc-950/80 p-6 backdrop-blur-md shadow-xl transition-all hover:border-white/20"
          >
            <div>
              {/* Star Rating & Verified */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                {rev.is_verified && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="h-3 w-3" /> {t("reviews.verified")}
                  </span>
                )}
              </div>

              {/* Comment */}
              <p className="text-sm text-zinc-300 leading-relaxed italic">
                &quot;{rev.comment}&quot;
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <div>
                <div className="font-bold text-white text-sm">{rev.client_name}</div>
                {rev.vehicle_info && (
                  <div className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                    <Car className="h-3 w-3 text-amber-400" /> {rev.vehicle_info}
                  </div>
                )}
                {rev.service_rendered && (
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    {rev.service_rendered}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 text-xs text-zinc-400">
                <ThumbsUp className="h-3.5 w-3.5 text-zinc-500" />
                <span>{rev.likes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
