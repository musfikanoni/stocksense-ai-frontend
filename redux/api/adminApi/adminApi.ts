import { baseApi } from "../baseApi";
import type {
  AdminStat,
  AdminUser,
  AdminBillingRow,
  Plan,
  PolicyDoc,
} from "../../type";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query<AdminStat, void>({
      query: () => "/api/admin/stats",
      providesTags: ["AdminUsers"],
    }),
    getAdminUsers: builder.query<
      { users: AdminUser[]; total: number; page: number; pages: number },
      { page?: number; q?: string; status?: string; plan?: string }
    >({
      query: (params) => ({ url: "/api/admin/users", params }),
      providesTags: ["AdminUsers"],
    }),
    getAdminUser: builder.query<
      {
        user: AdminUser;
        invoices: {
          _id: string;
          date: string;
          planLabel: string;
          amount: number;
          status: string;
        }[];
      },
      string
    >({
      query: (id) => `/api/admin/users/${id}`,
      providesTags: (_r, _e, id) => [{ type: "AdminUsers", id }],
    }),
    blockUser: builder.mutation<
      { user: AdminUser },
      { id: string; blocked: boolean }
    >({
      query: ({ id, blocked }) => ({
        url: `/api/admin/users/${id}/block`,
        method: "PATCH",
        body: { blocked },
      }),
      invalidatesTags: ["AdminUsers"],
    }),
    getAdminBilling: builder.query<
      {
        rows: AdminBillingRow[];
        totalRevenue: number;
        paidUsers: number;
        total: number;
        page: number;
        pages: number;
      },
      { page?: number; q?: string; status?: string; plan?: string }
    >({
      query: (params) => ({ url: "/api/admin/billing", params }),
      providesTags: ["AdminBilling"],
    }),
    adminCreatePlan: builder.mutation<
      Plan,
      { name: string; price: number; highlight: boolean; features: string[] }
    >({
      query: (body) => ({
        url: "/api/admin/plans",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Plans"],
    }),
    adminUpdatePlan: builder.mutation<
      Plan,
      {
        id: string;
        name: string;
        price: number;
        highlight: boolean;
        features: string[];
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/api/admin/plans/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Plans"],
    }),
    adminUpdatePolicy: builder.mutation<
      PolicyDoc,
      { key: string; text: string }
    >({
      query: ({ key, text }) => ({
        url: `/api/admin/policy/${key}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Policy"],
    }),
    getAdminNotifications: builder.query<
      { text: string; at: string }[],
      void
    >({
      query: () => "/api/admin/notifications",
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminStatsQuery,
  useGetAdminUsersQuery,
  useGetAdminUserQuery,
  useBlockUserMutation,
  useGetAdminBillingQuery,
  useAdminCreatePlanMutation,
  useAdminUpdatePlanMutation,
  useAdminUpdatePolicyMutation,
  useGetAdminNotificationsQuery,
} = adminApi;

