import { NextResponse } from "next/server";
import { getApprovedReviews } from "@/lib/schema";

export async function GET() {
  if (!process.env.DATABASE_URL_POOLED && !process.env.DATABASE_URL) {
    return NextResponse.json({ reviews: [] });
  }
  try {
    const reviews = await getApprovedReviews(6);
    return NextResponse.json({
      reviews: reviews.map((review) => ({
        id: review.id,
        client_name: review.client_name,
        rating: review.rating,
        comment: review.comment,
        vehicle_info: review.vehicle_info,
        service_rendered: review.service_rendered,
        is_verified: review.is_verified,
        likes: review.likes,
      })),
    });
  } catch (error) {
    console.error("Could not load public reviews", error);
    return NextResponse.json({ error: "No se pudieron cargar las opiniones" }, { status: 503 });
  }
}
