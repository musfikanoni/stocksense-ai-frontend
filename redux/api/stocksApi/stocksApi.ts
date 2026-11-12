import { baseApi } from "../baseApi";
import type { Stock, Range, MarketBiasItem } from "../../type";

export const stocksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStocks: builder.query<Stock[], { q?: string } | void>({
      query: (arg) => ({
        url: "/api/stocks",
        params: arg && arg.q ? { q: arg.q } : undefined,
      }),
      providesTags: ["Stock"],
    }),
    getStock: builder.query<Stock, string>({
      query: (symbol) => `/api/stocks/${symbol}`,
      providesTags: (_result, _error, symbol) => [{ type: "Stock", id: symbol }],
    }),
    getHistory: builder.query<
      { label: string; price: number }[],
      { symbol: string; range: Range }
    >({
      query: ({ symbol, range }) => ({
        url: `/api/stocks/${symbol}/history`,
        params: { range },
      }),
    }),
    getMarketBias: builder.query<MarketBiasItem[], void>({
      query: () => "/api/stocks/market/bias",
    }),
    getMarketStatus: builder.query<
      {
        mode: string;
        provider: string;
        notice: string | null;
        configured: boolean;
        marketOpen: boolean;
        stocksWithPrices: number;
        stocksTotal: number;
        lastPriceRefresh?: unknown;
        lastHistoryRefresh?: unknown;
      },
      void
    >({
      query: () => "/api/stocks/market/status",
    }),
    getStockSummary: builder.query<{ summary: string; source: string }, string>({
      query: (symbol) => `/api/stocks/${symbol}/summary`,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetStocksQuery,
  useGetStockQuery,
  useGetHistoryQuery,
  useGetMarketBiasQuery,
  useGetMarketStatusQuery,
  useGetStockSummaryQuery,
} = stocksApi;

