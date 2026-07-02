import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  rootScreen: 'AuthNavigator',
  authScreen: 'Login',
  isLoggedIn: false,
  googleProfileCache: null, // Temporary container for names/emails
  user: null,
  token: null,
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
    setGoogleProfileCache: (state, action) => {
      state.googleProfileCache = action.payload;
    },
    setAuthData: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    updateNavigationState: (state, action) => {
      state.rootScreen = action.payload.rootScreen;
      state.authScreen = action.payload.authScreen;
      state.isLoggedIn = action.payload.isLoggedIn;
    }
  },
});

export const {
  setRootScreen,
  setAuthScreen,
  setLoginStatus,
  setGoogleProfileCache,
  setAuthData,
  updateNavigationState
} = authSlice.actions;

export default authSlice.reducer;