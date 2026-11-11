import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { stocks, history, type Range, type Stock } from "@/lib/mockData";

// Frontend phase: data comes from lib/mockData.ts.
// Backend phase: swap fakeBaseQuery() for fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL })
// and replace each queryFn with a `query: () => "/stocks"` style call. Components stay unchanged.
export const api = createApi({
  reducerPath: "api",
  baseQuery: fakeBaseQuery<string>(),
  endpoints: (b) => ({
    getStocks: b.query<Stock[], void>({ queryFn: async () => ({ data: stocks }) }),
    getStock: b.query<Stock, string>({
      queryFn: async (symbol) => {
        const s = stocks.find((x) => x.symbol === symbol.toUpperCase());
        return s ? { data: s } : { error: "Stock not found" };
      },
    }),
    getHistory: b.query<{ label: string; price: number }[], { symbol: string; range: Range }>({
      queryFn: async ({ symbol, range }) => ({ data: history(symbol.toUpperCase(), range) }),
    }),
  }),
});

export const { useGetStocksQuery, useGetStockQuery, useGetHistoryQuery } = api;
