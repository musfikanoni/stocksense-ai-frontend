"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  useGetMyReviewQuery,
  useSubmitReviewMutation,
  useDeleteMyReviewMutation,
} from "@/redux/api/reviewsApi";
import Avatar from "./Avatar";
import { Icon } from "./icons";
import { useAuth } from "@/lib/authContext";

const PRESET_ROLES = [
  "Day Trader",
  "Swing Trader",
  "Options Trader",
  "Long-term Investor",
  "Scalper",
  "Crypto & Equities",
];

export default function ReviewSettingsTab({ boxClass }: { boxClass: string }) {
  const { user } = useAuth();
  const { data, isLoading } = useGetMyReviewQuery();
  const [submitReview, { isLoading: isSubmitting }] = useSubmitReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteMyReviewMutation();

  const [rating, setRating] = useState(5);
  const [role, setRole] = useState("Swing Trader");
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const existingReview = data?.review;

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating || 5);
      setRole(existingReview.role || "Trader");
      setComment(existingReview.comment || "");
    }
  }, [existingReview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please write a few words about your experience.");
      return;
    }
    try {
      await submitReview({
        rating,
        role: role.trim() || "Trader",
        comment: comment.trim(),
      }).unwrap();
      toast.success(
        existingReview
          ? "Review updated successfully!"
          : "Review submitted successfully!"
      );
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit review.");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteReview().unwrap();
      toast.success("Review removed.");
      setComment("");
      setRating(5);
      setIsEditing(false);
      setShowDeleteModal(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete review.");
    }
  };

  if (isLoading) {
    return (
      <div
        className={`card animate-fade-up ${boxClass} p-8 text-center text-mute`}
      >
        <p className="text-xs">Loading review status...</p>
      </div>
    );
  }

  // If user has a review and is not in edit mode, show the review card with edit/delete buttons
  if (existingReview && !isEditing) {
    return (
      <section className={`card animate-fade-up ${boxClass} space-y-5`}>
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div>
            <h3 className="font-semibold text-white">Your StockSense AI Review</h3>
            <p className="text-xs text-mute mt-0.5">
              This review is displayed on our landing page.
            </p>
          </div>
          <span className="rounded-full bg-up/15 px-3 py-1 text-xs font-medium text-up">
            Live
          </span>
        </div>

        {/* Preview of the review as seen on the landing page */}
        <div className="rounded-2xl border border-gold/30 bg-gradient-to-b from-[#16130b] to-black p-5 text-left shadow-lg">
          <div className="flex items-center gap-1 text-gold text-lg mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star}>
                {star <= (existingReview.rating || 5) ? "★" : "☆"}
              </span>
            ))}
          </div>
          <blockquote className="text-sm text-white/90 italic leading-relaxed">
            &ldquo;{existingReview.comment}&rdquo;
          </blockquote>
          <div className="mt-4 flex items-center gap-3 pt-3 border-t border-white/5">
            <Avatar
              name={existingReview.name}
              url={existingReview.avatarUrl}
              size={36}
            />
            <div>
              <p className="font-semibold text-xs text-white">
                {existingReview.name}
              </p>
              <p className="text-[11px] text-mute">{existingReview.role}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="btn-gold flex-1 text-xs py-2.5"
          >
            Edit Review
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            disabled={isDeleting}
            className="rounded-lg border border-down/40 px-4 py-2.5 text-xs text-down hover:bg-down/10 transition"
          >
            {isDeleting ? "Removing..." : "Delete"}
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div
            className="animate-fade-in fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Confirm Delete Review"
            onClick={() => !isDeleting && setShowDeleteModal(false)}
          >
            <div
              className="card animate-scale-in w-full max-w-sm space-y-4 text-center border border-line bg-[#0d0d0d] shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-down/15 border border-down/30 text-down">
                <Icon name="trash" className="h-7 w-7" />
              </div>
              <div>
                <h2 className="font-semibold text-lg text-white">Delete Your Review?</h2>
                <p className="mt-2 text-xs text-mute leading-relaxed">
                  Are you sure you want to remove your review? It will be permanently removed from the platform and landing page.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  className="btn-outline flex-1 text-xs py-2.5"
                  disabled={isDeleting}
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-down py-2.5 text-xs font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                >
                  {isDeleting ? "Removing…" : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className={`card animate-fade-up ${boxClass} space-y-5`}>
      <div className="border-b border-line pb-3">
        <h3 className="font-semibold text-white">
          {existingReview ? "Edit Your Review" : "Share Your Experience"}
        </h3>
        <p className="text-xs text-mute mt-0.5">
          Your feedback helps fellow traders learn more about StockSense AI and helps
          improve our AI signals.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Stars */}
        <div>
          <label className="block text-xs font-medium text-mute mb-1.5">
            Your Overall Rating
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = hoverRating ? star <= hoverRating : star <= rating;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-2xl transition-transform hover:scale-125 focus:outline-none"
                  aria-label={`${star} star`}
                >
                  <span className={active ? "text-gold" : "text-white/20"}>
                    ★
                  </span>
                </button>
              );
            })}
            <span className="text-xs text-mute ml-2">
              {rating === 5
                ? "Exceptional (5/5)"
                : rating === 4
                ? "Great (4/5)"
                : rating === 3
                ? "Good (3/5)"
                : rating === 2
                ? "Fair (2/5)"
                : "Poor (1/5)"}
            </span>
          </div>
        </div>

        {/* Trader Role */}
        <div>
          <label className="block text-xs font-medium text-mute mb-1.5">
            Your Trading Style / Role
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {PRESET_ROLES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`rounded-full px-3 py-1 text-xs transition ${
                  role === r
                    ? "bg-gold text-ink font-semibold"
                    : "border border-line bg-white/5 text-mute hover:text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Swing Trader, Momentum Trader"
            maxLength={50}
            className="input w-full text-xs"
            required
          />
        </div>

        {/* Comment */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-mute">
              Your Review / Testimonial
            </label>
            <span className="text-[11px] text-mute">{comment.length}/500</span>
          </div>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How has StockSense AI's analysis, trade signals, or price alerts helped your trading journey?"
            maxLength={500}
            required
            className="input w-full text-xs leading-relaxed resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          {existingReview && (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn-outline flex-1 text-xs py-2.5"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !comment.trim()}
            className="btn-gold flex-1 text-xs py-2.5 disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving…"
              : existingReview
              ? "Update Review"
              : "Submit Review"}
          </button>
        </div>
      </form>
    </section>
  );
}
