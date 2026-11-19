import { baseApi } from "../baseApi";
import type { Plan, PolicyDoc } from "../../type";

export const plansApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query<Plan[], void>({
      query: () => "/api/plans",
      providesTags: ["Plans"],
      keepUnusedDataFor: 1800,
    }),
    getPolicy: builder.query<Record<string, PolicyDoc>, void>({
      query: () => "/api/policy",
      providesTags: ["Policy"],
      keepUnusedDataFor: 1800,
    }),
  }),
  overrideExisting: false,
});

export const { useGetPlansQuery, useGetPolicyQuery } = plansApi;

