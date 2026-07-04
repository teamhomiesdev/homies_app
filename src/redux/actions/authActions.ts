import { getProfileApi, loginApi, registerApi, updateProfileApi } from '../../services/authService';
import { setAuthData, updateNavigationState } from '../slices/authSlice';

export const registerAction = (payload: any) => {
  return async (dispatch: any) => {
    try {
      const response = await registerApi(payload);

      if (response && response.success) {
        // 1. Store the registered user and token details in Redux
        dispatch(setAuthData({
          user: response.data.user,
          token: response.data.token
        }));

        const user = response.data.user;
        let targetScreen = 'MainTabNavigator';

        // 2. Perform sequential verification flow evaluations
        if (!user.isImageVerified) {
          dispatch(updateNavigationState({
            rootScreen: 'AuthNavigator',
            authScreen: 'FaceVerification',
            isLoggedIn: false
          }));
          targetScreen = 'FaceVerification';
        } 
        else if (!user.helps || user.helps.length < 1) {
          dispatch(updateNavigationState({
            rootScreen: 'AuthNavigator',
            authScreen: 'HelpSelection',
            isLoggedIn: false
          }));
          targetScreen = 'HelpSelection';
        } 
        else if (!user.interests || user.interests.length < 1) {
          dispatch(updateNavigationState({
            rootScreen: 'AuthNavigator',
            authScreen: 'InterestSelection', 
            isLoggedIn: false
          }));
          targetScreen = 'InterestSelection';
        } 
        else {
          dispatch(updateNavigationState({
            rootScreen: 'MainTabNavigator',
            authScreen: 'Login',
            isLoggedIn: true
          }));
          targetScreen = 'MainTabNavigator';
        }

        return { success: true, targetScreen };
      } else {
        return { success: false, error: 'Registration failed' };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error?.response?.data?.message || error.message || 'Something went wrong',
      };
    }
  };
};

export const loginAction = (payload: any) => {
  return async (dispatch: any) => {
    try {
      const response = await loginApi(payload);

      if (response && response.success) {
        // 1. Store the logged-in user and token details in Redux
        dispatch(setAuthData({
          user: response.data.user,
          token: response.data.token
        }));

        const user = response.data.user;
        let targetScreen = 'MainTabNavigator';

        // 2. Perform sequential verification flow evaluations based on rules
        if (!user.isImageVerified) {
          dispatch(updateNavigationState({
            rootScreen: 'AuthNavigator',
            authScreen: 'FaceVerification',
            isLoggedIn: false
          }));
          targetScreen = 'FaceVerification';
        } 
        else if (!user.helps || user.helps.length < 1) {
          dispatch(updateNavigationState({
            rootScreen: 'AuthNavigator',
            authScreen: 'HelpSelection',
            isLoggedIn: false
          }));
          targetScreen = 'HelpSelection';
        } 
        else if (!user.interests || user.interests.length < 1) {
          dispatch(updateNavigationState({
            rootScreen: 'AuthNavigator',
            authScreen: 'InterestSelection', 
            isLoggedIn: false
          }));
          targetScreen = 'InterestSelection';
        } 
        else {
          dispatch(updateNavigationState({
            rootScreen: 'MainTabNavigator',
            authScreen: 'Login',
            isLoggedIn: true
          }));
          targetScreen = 'MainTabNavigator';
        }

        return { success: true, targetScreen };
      } else {
        return { success: false, error: response?.message || 'Login failed' };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error?.response?.data?.message || error.message || 'Something went wrong',
      };
    }
  };
};

export const updateProfileFieldsAction = (fieldsToUpdate: { helps?: string[]; interests?: string[] }) => {
  return async (dispatch: any, getState: any) => {
    try {
      // 1. Get current authenticating user context from global state
      const authState = getState().auth;
      const userId = authState.user?._id || authState.user?.id;

      if (!userId) {
        return { success: false, error: 'User ID not found. Please log in again.' };
      }

      // 2. Build the payload dynamically (omits empty fields entirely)
      const requestPayload: any = {
        id: userId,
        ...fieldsToUpdate
      };

      const response = await updateProfileApi(requestPayload);

      if (response && response.success) {
        // 3. Keep local Redux cache completely synchronized
        const updatedUser = {
          ...authState.user,
          ...fieldsToUpdate
        };

        dispatch(setAuthData({
          user: updatedUser,
          token: authState.token,
        }));

        return { success: true };
      } else {
        return { success: false, error: response?.message || 'Profile update failed.' };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error?.response?.data?.message || error.message || 'Something went wrong.',
      };
    }
  };
};

export const fetchUserProfileAction = (userId: string) => {
  return async (dispatch: any, getState: any) => {
    try {
      const response = await getProfileApi(userId);

      if (response && response.success) {
        const authState = getState().auth;
        
        // Synchronize local Redux cache without losing current token
        dispatch(setAuthData({
          user: response.data.user,
          token: authState.token,
        }));

        return { success: true, data: response.data.user };
      } else {
        return { success: false, error: response?.message || 'Failed to retrieve profile.' };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error?.response?.data?.message || error.message || 'Something went wrong.',
      };
    }
  };
};