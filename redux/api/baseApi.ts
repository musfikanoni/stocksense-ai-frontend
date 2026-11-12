import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

export const getApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  // Strip trailing slashes and normalize: if url ends with /api/v1 or /api, strip it
  // because all endpoint paths in our slices explicitly start with /api/...
  return envUrl.trim().replace(/\/+$/, "").replace(/\/api(\/v1)?$/i, "");
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token =
        state?.user?.token ||
        (typeof window !== "undefined"
          ? localStorage.getItem("ss_token")
          : null);

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Stock",
    "Watchlist",
    "Alerts",
    "Plans",
    "Dashboard",
    "Billing",
    "Notifications",
    "AdminUsers",
    "AdminBilling",
    "Policy",
    "User",
  ],
  endpoints: () => ({}),
});


