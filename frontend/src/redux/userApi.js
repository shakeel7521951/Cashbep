import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../baseUrl';
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/v1`,

    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: ['profile'],
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (personData) => ({
        url: '/signup',
        method: 'POST',
        body: personData,
      }),
    }),
    login: builder.mutation({
      query: (loginData) => ({
        url: '/login',
        method: 'POST',
        body: loginData,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),
    getProfile: builder.query({
      query: () => ({
        url: '/profile',
        method: 'GET',
      }),
      providesTags: ['profile'], // Query provides the 'Posts' tag
    }),
    getPoints: builder.query({
      query: () => ({
        url: '/points',
        method: 'GET',
      }),
    }),
    updatePassword: builder.mutation({
      query: (updatePassword) => ({
        url: '/updatePass',
        method: 'PUT',
        body: updatePassword,
      }),
    }),
    getRefferalUsers: builder.query({
      query: (referralCode) => ({
        url: `/getRef?referralCode=${referralCode}`,
        method: 'GET',
      }),
    }),
    sendFeedback: builder.mutation({
      query: (content) => ({
        url: '/feedback',
        method: 'POST',
        body: content,
      }),
    }),
    changeBepCoin: builder.mutation({
      query: (id) => ({
        url: `/convert-points/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: ['profile'],
    }),
    changeExtraBepCoin: builder.mutation({
      query: (id) => ({
        url: `/refConvert-points/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: ['profile'],
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useGetProfileQuery,
  useLogoutMutation,
  useUpdatePasswordMutation,
  useLazyGetPointsQuery,
  useGetRefferalUsersQuery,
  useSendFeedbackMutation,
  useChangeBepCoinMutation,
  useChangeExtraBepCoinMutation,
} = userApi;
