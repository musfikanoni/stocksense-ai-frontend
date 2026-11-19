// src/components/landing/LandingReviews.tsx
"use client";
import Avatar from "@/components/Avatar";
import { useGetPublicReviewsQuery } from "@/redux/api/reviewsApi";

interface ReviewCard {
  q: string;
  n: string;
  r: string;
  rating: number;
  avatar?: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <p className="text-gold tracking-wide" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      {"☆".repeat(Math.max(0, 5 - rating))}
    </p>
  );
}

function ReviewCard({ card }: { card: ReviewCard }) {
  return (
    <figure className="flex min-h-[210px] w-[290px] sm:w-[340px] flex-col justify-between rounded-2xl border border-line bg-gradient-to-b from-[#121009] to-black p-5 sm:p-6 text-left">
      <StarRating rating={card.rating} />
      <blockquote className="my-3 text-sm text-white/80 leading-relaxed line-clamp-4">
        &ldquo;{card.q}&rdquo;
      </blockquote>
      <figcaption className="flex items-center gap-3 pt-2 border-t border-white/5">
        <Avatar name={card.n} url={card.avatar} size={34} />
        <div className="min-w-0 flex-1">
          <b className="block truncate text-xs text-white">{card.n}</b>
          <span className="block truncate text-[11px] text-mute">{card.r}</span>
        </div>
      </figcaption>
    </figure>
  );
}

export default function LandingReviews() {
  const { data: raw = [] } = useGetPublicReviewsQuery();

  const reviews: ReviewCard[] = raw.map((r) => ({
    q: r.comment,
    n: r.name,
    r: r.role,
    rating: r.rating || 5,
    avatar: r.avatarUrl,
  }));

  return (
    <section id="review" className="py-12 sm:py-16 text-center px-4 sm:px-6">
      <h2 className="text-3xl font-bold sm:text-4xl">
        Trusted By <span className="text-gold">Traders</span>
      </h2>
      <p className="mb-8 sm:mb-10 mt-3 text-sm sm:text-base text-white/70">
        Helping traders make smarter decisions with intelligent market insights.
      </p>

      {reviews.length === 0 ? (
        <p className="text-sm text-mute">No reviews yet.</p>
      ) : reviews.length < 4 ? (
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-4 sm:gap-6 text-left">
          {reviews.map((r, i) => (
            <figure
              key={i}
              className="flex min-h-[210px] w-full max-w-[340px] flex-col justify-between rounded-2xl border border-line bg-gradient-to-b from-[#121009] to-black p-5 sm:p-6"
            >
              <StarRating rating={r.rating} />
              <blockquote className="my-3 text-sm text-white/80 leading-relaxed line-clamp-4">
                &ldquo;{r.q}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3 pt-2 border-t border-white/5">
                <Avatar name={r.n} url={r.avatar} size={34} />
                <div className="min-w-0 flex-1">
                  <b className="block truncate text-xs text-white">{r.n}</b>
                  <span className="block truncate text-[11px] text-mute">{r.r}</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className="group overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="flex w-max animate-marquee gap-4 sm:gap-5 [animation-duration:70s] group-hover:[animation-play-state:paused]">
            {[...reviews, ...reviews].map((r, i) => (
              <div key={i} aria-hidden={i >= reviews.length}>
                <ReviewCard card={r} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
