import { baseApi } from "../baseApi";
import type { Stock } from "../../type";

export const watchlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWatchlist: builder.query<Stock[], void>({
      query: () => "/api/watchlist",
      providesTags: ["Watchlist"],
    }),
    addToWatchlist: builder.mutation<Stock[], string>({
      query: (symbol) => ({
        url: "/api/watchlist",
        method: "POST",
        body: { symbol },
      }),
      invalidatesTags: ["Watchlist"],
    }),
    removeFromWatchlist: builder.mutation<Stock[], string>({
      query: (symbol) => ({
        url: `/api/watchlist/${symbol}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Watchlist"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetWatchlistQuery,
  useAddToWatchlistMutation,
  useRemoveFromWatchlistMutation,
} = watchlistApi;

