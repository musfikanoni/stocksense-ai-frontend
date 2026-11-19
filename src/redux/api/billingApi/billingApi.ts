import { baseApi } from "../baseApi";
import type { BillingInfo } from "../../type";

export const billingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBilling: builder.query<BillingInfo, void>({
      query: () => "/api/billing",
      providesTags: ["Billing"],
    }),
    createCheckout: builder.mutation<
      { url: string },
      { planId: string; cycle: "Monthly" | "Yearly" }
    >({
      query: (body) => ({
        url: "/api/billing/checkout",
        method: "POST",
        body,
      }),
    }),
    createPortal: builder.mutation<{ url: string }, void>({
      query: () => ({
        url: "/api/billing/portal",
        method: "POST",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBillingQuery,
  useCreateCheckoutMutation,
  useCreatePortalMutation,
} = billingApi;

