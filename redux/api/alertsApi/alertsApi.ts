import { baseApi } from "../baseApi";
import type { AlertItem, AlertKind, Signal } from "../../type";

export const alertsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAlerts: builder.query<
      AlertItem[],
      { status?: "active" | "disabled" } | void
    >({
      query: (arg) => ({
        url: "/api/alerts",
        params:
          arg && (arg as { status?: string }).status
            ? { status: (arg as { status?: string }).status }
            : undefined,
      }),
      providesTags: ["Alerts"],
    }),
    createAlert: builder.mutation<
      AlertItem[],
      {
        symbol: string;
        conditions: {
          price?: number;
          breakout?: number;
          signal?: Signal;
          volume?: number;
        };
        channels: { email: boolean; push: boolean; discord: boolean };
      }
    >({
      query: (body) => ({
        url: "/api/alerts",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Alerts"],
    }),
    updateAlert: builder.mutation<
      AlertItem,
      {
        id: string;
        body: {
          active?: boolean;
          kind?: AlertKind;
          value?: number | Signal;
          channels?: { email?: boolean; push?: boolean; discord?: boolean };
        };
      }
    >({
      query: ({ id, body }) => ({
        url: `/api/alerts/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Alerts"],
    }),
    deleteAlert: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/alerts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Alerts"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAlertsQuery,
  useCreateAlertMutation,
  useUpdateAlertMutation,
  useDeleteAlertMutation,
} = alertsApi;

