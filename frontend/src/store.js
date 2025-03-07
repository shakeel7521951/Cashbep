import { configureStore } from '@reduxjs/toolkit';
import { userApi } from './redux/userApi';
import { taskApi } from './redux/taskApi';
import userSlice from './redux/userSlice';

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
    user: userSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware,taskApi.middleware),
});
