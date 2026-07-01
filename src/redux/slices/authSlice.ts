import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  rootScreen: 'AuthNavigator',
  authScreen: 'Login',
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRootScreen: (state, action) => {
      state.rootScreen = action.payload;
    },
    setAuthScreen: (state, action) => {
      state.authScreen = action.payload;
    },
    setLoginStatus: (state, action) => {
      state.isLoggedIn = action.payload;
    },
  },
});

export const {
  setRootScreen,
  setAuthScreen,
  setLoginStatus,
} = authSlice.actions;

export default authSlice.reducer;