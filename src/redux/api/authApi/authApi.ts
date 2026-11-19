import { baseApi } from "../baseApi";
import type { AuthUser } from "../../type";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      { token: string; user: AuthUser },
      { email?: FormDataEntryValue | string; password?: FormDataEntryValue | string }
    >({
      query: (body) => ({
        url: "/api/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    signup: builder.mutation<
      { token: string; user: AuthUser },
      {
        name?: FormDataEntryValue | string;
        email?: FormDataEntryValue | string;
        password?: FormDataEntryValue | string;
      }
    >({
      query: (body) => ({
        url: "/api/auth/signup",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    googleAuth: builder.mutation<
      { token: string; user: AuthUser },
      { credential?: string }
    >({
      query: (body) => ({
        url: "/api/auth/google",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    forgotPassword: builder.mutation<
      { message: string; devOtp?: string },
      { email: string }
    >({
      query: (body) => ({
        url: "/api/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),
    verifyOtp: builder.mutation<
      { resetToken: string },
      { email: string; otp: string }
    >({
      query: (body) => ({
        url: "/api/auth/verify-otp",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<
      { message: string },
      { resetToken: string; password?: string }
    >({
      query: (body) => ({
        url: "/api/auth/reset-password",
        method: "POST",
        body,
      }),
    }),
    getMe: builder.query<{ user: AuthUser }, void>({
      query: () => "/api/auth/me",
      providesTags: ["User"],
    }),
    updateMe: builder.mutation<
      { user: AuthUser },
      { firstName?: string; lastName?: string; discordWebhookUrl?: string | null }
    >({
      query: (body) => ({
        url: "/api/auth/me",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    changePassword: builder.mutation<
      { token: string; user: AuthUser },
      { currentPassword?: string; newPassword?: string }
    >({
      query: (body) => ({
        url: "/api/auth/me/password",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    deleteAccount: builder.mutation<
      { message: string },
      { password?: string; confirm?: string }
    >({
      query: (body) => ({
        url: "/api/auth/me",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    testDiscord: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/api/auth/me/discord/test",
        method: "POST",
      }),
    }),
    getAvatarSignature: builder.mutation<
      {
        uploadUrl: string;
        apiKey: string;
        timestamp: number;
        signature: string;
        fields: Record<string, string>;
      },
      void
    >({
      query: () => ({
        url: "/api/auth/me/avatar/signature",
        method: "POST",
      }),
    }),
    updateAvatar: builder.mutation<{ user: AuthUser }, { url: string }>({
      query: (body) => ({
        url: "/api/auth/me/avatar",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    deleteAvatar: builder.mutation<{ user: AuthUser }, void>({
      query: () => ({
        url: "/api/auth/me/avatar",
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useSignupMutation,
  useGoogleAuthMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useGetMeQuery,
  useUpdateMeMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useTestDiscordMutation,
  useGetAvatarSignatureMutation,
  useUpdateAvatarMutation,
  useDeleteAvatarMutation,
} = authApi;

