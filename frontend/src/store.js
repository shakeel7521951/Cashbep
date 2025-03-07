import { configureStore } from '@reduxjs/toolkit';
import { userApi } from './redux/userApi';
import userSlice from './redux/userSlice';

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    user: userSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
});
