import { baseApi } from "./baseApi";

export interface ReviewItem {
  id: string;
  name: string;
  avatarUrl?: string;
  role: string;
  rating: number;
  comment: string;
  status?: "pending" | "approved" | "rejected";
  createdAt?: string;
}

export interface SubmitReviewDto {
  rating: number;
  role: string;
  comment: string;
}

export interface AdminReviewsResponse {
  reviews: ReviewItem[];
  total: number;
  page: number;
  pages: number;
}

export interface AdminReviewsQuery {
  status?: string;
  q?: string;
  page?: number;
  limit?: number;
}

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicReviews: builder.query<ReviewItem[], void>({
      query: () => "/api/reviews/public",
      providesTags: ["Reviews"],
    }),
    getMyReview: builder.query<{ review: ReviewItem | null }, void>({
      query: () => "/api/reviews/mine",
      providesTags: ["Reviews"],
    }),
    submitReview: builder.mutation<
      { message: string; review: ReviewItem },
      SubmitReviewDto
    >({
      query: (body) => ({
        url: "/api/reviews",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reviews"],
    }),
    deleteMyReview: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/api/reviews/mine",
        method: "DELETE",
      }),
      invalidatesTags: ["Reviews"],
    }),
    getAdminReviews: builder.query<AdminReviewsResponse, AdminReviewsQuery | void>({
      query: (params) => ({
        url: "/api/admin/reviews",
        params: params || {},
      }),
      providesTags: ["Reviews"],
    }),
    updateReviewStatus: builder.mutation<
      { message: string; review: ReviewItem },
      { id: string; status: "pending" | "approved" | "rejected" }
    >({
      query: ({ id, status }) => ({
        url: `/api/admin/reviews/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Reviews"],
    }),
    deleteAdminReview: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/admin/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reviews"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPublicReviewsQuery,
  useGetMyReviewQuery,
  useSubmitReviewMutation,
  useDeleteMyReviewMutation,
  useGetAdminReviewsQuery,
  useUpdateReviewStatusMutation,
  useDeleteAdminReviewMutation,
} = reviewsApi;
