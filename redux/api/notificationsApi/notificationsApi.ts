import { baseApi } from "../baseApi";
import type { NotificationItem } from "../../type";

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      { items: NotificationItem[]; unread: number },
      void
    >({
      query: () => "/api/notifications",
      providesTags: ["Notifications"],
    }),
    markAllRead: builder.mutation<{ unread: number }, void>({
      query: () => ({
        url: "/api/notifications/read-all",
        method: "POST",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetNotificationsQuery, useMarkAllReadMutation } =
  notificationsApi;

