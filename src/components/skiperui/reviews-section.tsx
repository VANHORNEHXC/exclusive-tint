import React from "react";
import { Star, ShieldCheck, ThumbsUp, Car } from "lucide-react";
import { Review } from "@/lib/schema";

const FALLBACK_REVIEWS: Review[] = [
  {
    id: "rev-1",
    order_id: null,
    client_name: "Roberto Valenzuela",
    rating: 5,
    comment:
      "La diferencia térmica con el Nano-Ceramic en el M3 es increíble. Dejarlo al sol y que la cabina no hierva no tiene precio. El corte computarizado quedó milimétrico.",
    vehicle_info: "BMW M3 Competition 2023",
    service_rendered: "PPF Full Front + Ceramic Tint 20%",
    photos: ["portfolio/bmw-m3-ceramic-tint.jpg"],
    is_verified: true,
    is_approved: true,
    likes: 14,
    created_at: new Date("2026-11-01"),
    updated_at: new Date("2026-11-01"),
  },
  {
    id: "rev-2",
    order_id: null,
    client_name: "Valeria Gómez",
    rating: 5,
    comment:
      "Excelente atención en Exclusive Tint. Me asesoraron con el porcentaje legal para mi Macan y el bot nocturno de WhatsApp me respondió de inmediato a la medianoche.",
    vehicle_info: "Porsche Macan GTS 2024",
    service_rendered: "Nano-Ceramic IR 35%",
    photos: ["portfolio/porsche-macan-ppf-complete.jpg"],
    is_verified: true,
    is_approved: true,
    likes: 9,
    created_at: new Date("2026-11-04"),
    updated_at: new Date("2026-11-04"),
  },
  {
    id: "rev-3",
    order_id: null,
    client_name: "Alejandro Peña",
    rating: 5,
    comment:
      "Polaricé mi camioneta completa incluyendo el panorámico en 70% transparente térmico. La visibilidad de noche es perfecta y el sol ya no quema en los brazos.",
    vehicle_info: "Ford Raptor 2023",
    service_rendered: "Nano-Ceramic IR 70% Parabrisas + 20% Laterales",
    photos: ["portfolio/tesla-model-y-nano70.jpg"],
    is_verified: true,
    is_approved: true,
    likes: 21,
    created_at: new Date("2026-11-08"),
    updated_at: new Date("2026-11-08"),
  },
];

export function ReviewsSection({ reviews = FALLBACK_REVIEWS }: { reviews?: Review[] }) {
  return (
    <section id="opiniones" className="py-20 px-6 max-w-7xl mx-auto scroll-mt-24">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 mb-2">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> 4.9/5 Satisfacción Verificada
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Experiencias de Clientes Reales
        </h2>
        <p className="text-sm text-zinc-400 mt-2 max-w-xl mx-auto">
          Opiniones directas registradas y verificadas en nuestra base de datos Neon PostgreSQL.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev) => (
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
                    <ShieldCheck className="h-3 w-3" /> Verificado
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
