import { baseApi } from "./baseApi";

export interface ContactDto {
  name: string;
  email: string;
  message: string;
}

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendContactMessage: builder.mutation<{ success: boolean; message: string }, ContactDto>({
      query: (body) => ({
        url: "/api/contact",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useSendContactMessageMutation } = contactApi;
