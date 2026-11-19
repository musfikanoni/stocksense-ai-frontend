"use client";
import { useState } from "react";
import { toast } from "sonner";
import {
  useGetAdminReviewsQuery,
  useUpdateReviewStatusMutation,
  useDeleteAdminReviewMutation,
  type ReviewItem,
} from "@/redux/api/reviewsApi";
import Avatar from "@/components/Avatar";
import Helmet from "@/components/Helmet";
import StatCard from "@/components/StatCard";
import { Icon } from "@/components/icons";
import { useDebounce } from "@/hooks/useDebounce";

export default function AdminReviewsView() {
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 300);
  const [status, setStatus] = useState("All Status");
  const [page, setPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<{ id: string; name: string } | null>(null);

  const { data, isLoading } = useGetAdminReviewsQuery({
    q: debouncedQ.trim() || undefined,
    status: status !== "All Status" ? status.toLowerCase() : undefined,
    page,
    limit: 10,
  });

  const [updateStatus, { isLoading: isUpdating }] = useUpdateReviewStatusMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteAdminReviewMutation();

  const reviews = data?.reviews ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.pages ?? 1;

  // Quick stats derived from all data
  const approvedCount = reviews.filter((r) => r.status === "approved").length;
  const pendingCount = reviews.filter((r) => r.status === "pending").length;
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / reviews.length).toFixed(1)
      : "5.0";

  const handleStatusChange = async (id: string, newStatus: "approved" | "rejected" | "pending") => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success(`Review ${newStatus} successfully.`);
    } catch (e: unknown) {
      const msg = (e as { data?: { message?: string } })?.data?.message ?? "Failed to update review status.";
      toast.error(msg);
    }
  };

  const confirmDeleteReview = async () => {
    if (!reviewToDelete) return;
    try {
      await deleteReview(reviewToDelete.id).unwrap();
      toast.success("Review deleted successfully.");
      if (selectedReview?.id === reviewToDelete.id) setSelectedReview(null);
      setReviewToDelete(null);
    } catch (e: unknown) {
      const msg =
        (e as { data?: { message?: string } })?.data?.message ??
        "Failed to delete review.";
      toast.error(msg);
    }
  };

  const statCards = [
    { label: "Total Reviews", value: total, delta: "all time", note: "customer feedback", up: true },
    { label: "Approved Reviews", value: approvedCount, delta: "visible", note: "on landing page", up: true },
    { label: "Pending Reviews", value: pendingCount, delta: pendingCount > 0 ? "needs review" : "none pending", note: "moderation queue", up: pendingCount === 0 },

  ];

  return (
    <div className="space-y-6">
      <Helmet
        title="Review Management | Admin"
        description="Moderate, approve, and manage customer reviews."
        noIndex
      />
      <div className="stagger grid gap-4 grid-cols-1 sm:grid-cols-3">
        {statCards.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <section className="card !p-4 sm:!p-6 w-full min-w-0">
        <div className="mb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
          <h2 className="font-semibold text-base sm:text-lg shrink-0">User Reviews List ({total})</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
            <input
              className="input w-full sm:flex-1 lg:w-64 text-xs sm:text-sm min-w-0"
              placeholder="Search reviewer or comment..."
              aria-label="Search reviews"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
            <select
              aria-label="Filter by status"
              className="input w-full sm:w-40 text-xs sm:text-sm shrink-0"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              {["All Status", "Approved", "Pending", "Rejected"].map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2 py-4">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="h-14 animate-pulse rounded bg-white/5" />
            ))}
          </div>
        ) : (
          <div className="w-full overflow-x-auto [scrollbar-width:thin] [scrollbar-color:rgba(245,200,75,0.25)_transparent] -mx-4 sm:-mx-6 px-4 sm:px-6">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="text-xs text-mute">
                <tr className="border-b border-line">
                  <th className="pb-3 font-normal w-[22%] min-w-[140px]">Reviewer</th>
                  <th className="pb-3 font-normal w-[16%] min-w-[100px]">Rating</th>
                  <th className="pb-3 font-normal w-[34%] min-w-[180px]">Comment</th>
                  <th className="pb-3 font-normal w-[13%] min-w-[85px]">Status</th>
                  <th className="pb-3 font-normal w-[15%] min-w-[115px] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="stagger divide-y divide-line/60">
                {reviews.map((r) => {
                  const isApproved = r.status === "approved";
                  const isRejected = r.status === "rejected";

                  return (
                    <tr key={r.id} className="transition hover:bg-white/5">
                      <td className="py-3">
                        <span className="flex items-center gap-2.5 sm:gap-3">
                          <Avatar name={r.name} url={r.avatarUrl} size={32} />
                          <span className="min-w-0">
                            <b className="block text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[150px]">{r.name}</b>
                            <span className="text-[11px] sm:text-xs text-mute truncate block max-w-[120px]">{r.role || "Trader"}</span>
                          </span>
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1 text-gold text-xs whitespace-nowrap">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i}>{i < (r.rating || 5) ? "★" : "☆"}</span>
                          ))}
                          <span className="ml-1 text-mute font-mono text-[11px]">({r.rating || 5})</span>
                        </div>
                      </td>
                      <td className="max-w-[240px]">
                        <p
                          className="text-xs text-mute cursor-pointer hover:text-white line-clamp-2 leading-relaxed"
                          title={r.comment}
                          onClick={() => setSelectedReview(r)}
                        >
                          &ldquo;{r.comment}&rdquo;
                        </p>
                      </td>
                      <td>
                        <span
                          className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            isApproved
                              ? "bg-up/15 text-up border border-up/20"
                              : isRejected
                              ? "bg-down/15 text-down border border-down/20"
                              : "bg-gold/15 text-gold border border-gold/20"
                          }`}
                        >
                          {r.status ? r.status.charAt(0).toUpperCase() + r.status.slice(1) : "Approved"}
                        </span>
                      </td>
                      <td className="text-right">
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                          {!isApproved && (
                            <button
                              disabled={isUpdating}
                              onClick={() => handleStatusChange(r.id, "approved")}
                              className="rounded-lg bg-up/20 border border-up/40 px-2 sm:px-2.5 py-1 text-xs font-medium text-up transition hover:bg-up hover:text-black"
                              title="Approve and show on landing page"
                            >
                              Approve
                            </button>
                          )}
                          {!isRejected && (
                            <button
                              disabled={isUpdating}
                              onClick={() => handleStatusChange(r.id, "rejected")}
                              className="rounded-lg bg-down/20 border border-down/40 px-2 sm:px-2.5 py-1 text-xs font-medium text-down transition hover:bg-down hover:text-white"
                              title="Reject / hide from landing page"
                            >
                              Reject
                            </button>
                          )}
                          <button
                            disabled={isDeleting}
                            onClick={() => setReviewToDelete({ id: r.id, name: r.name })}
                            className="rounded-lg bg-white/5 border border-line px-2 sm:px-2.5 py-1 text-xs font-medium text-mute transition hover:bg-down hover:border-down hover:text-white"
                            title="Permanently delete review"
                          >
                            Delete
                          </button>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {reviews.length === 0 && !isLoading && (
          <p className="py-8 text-center text-sm text-mute">No reviews match the selected filters.</p>
        )}

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-4 text-xs text-mute">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="btn-gold !px-3 !py-1 disabled:opacity-30"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="btn-gold !px-3 !py-1 disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Review details modal for reading long comments */}
      {selectedReview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedReview(null)}
        >
          <div
            className="card max-w-lg w-full space-y-4 border border-line p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-3">
                <Avatar name={selectedReview.name} url={selectedReview.avatarUrl} size={42} />
                <div>
                  <h3 className="font-semibold text-white">{selectedReview.name}</h3>
                  <p className="text-xs text-mute">{selectedReview.role}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReview(null)}
                className="text-mute hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div>
              <div className="mb-2 flex items-center gap-1 text-gold text-sm">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>{i < (selectedReview.rating || 5) ? "★" : "☆"}</span>
                ))}
                <span className="ml-1 text-xs text-mute">({selectedReview.rating || 5} / 5)</span>
              </div>
              <p className="text-sm leading-relaxed text-mute whitespace-pre-wrap">
                &ldquo;{selectedReview.comment}&rdquo;
              </p>
            </div>
            <div className="flex justify-end gap-2 border-t border-line pt-3">
              <button
                onClick={() => setSelectedReview(null)}
                className="rounded-lg bg-white/10 px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/15"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {reviewToDelete && (
        <div
          className="animate-fade-in fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Confirm Delete Review"
          onClick={() => !isDeleting && setReviewToDelete(null)}
        >
          <div
            className="card animate-scale-in w-full max-w-sm space-y-4 text-center border border-line bg-[#0d0d0d] shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-down/15 border border-down/30 text-down">
              <Icon name="trash" className="h-7 w-7" />
            </div>
            <div>
              <h2 className="font-semibold text-lg text-white">Delete Review?</h2>
              <p className="mt-2 text-xs text-mute leading-relaxed">
                Are you sure you want to permanently delete the review from{" "}
                <span className="font-semibold text-white">{reviewToDelete.name}</span>?
                This action cannot be undone and will remove it from the landing page.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                className="btn-outline flex-1 text-xs py-2.5"
                disabled={isDeleting}
                onClick={() => setReviewToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="flex-1 rounded-lg bg-down py-2.5 text-xs font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
                disabled={isDeleting}
                onClick={confirmDeleteReview}
              >
                {isDeleting ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
