import { createSlice } from '@reduxjs/toolkit';

const storedProfile = localStorage.getItem('userProfile');
const initialProfile = storedProfile ? JSON.parse(storedProfile) : null;

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: initialProfile,
  },
  reducers: {
    setProfile: (state, action) => {
      state.profile = action?.payload;
      localStorage.setItem('userProfile', JSON.stringify(action?.payload));
    },
    clearProfile: (state) => {
      state.profile = null;
      localStorage.removeItem('userProfile');
    },
  },
});

export const { setProfile, clearProfile } = userSlice.actions;
export default userSlice.reducer;
