import { loginApi } from '../../services/authService';
import { setLoginStatus } from '../slices/authSlice';

export const loginAction = (payload: any) => {
  return async (dispatch: any) => {
    try {
      const response = await loginApi(payload);

      dispatch(setLoginStatus(true));

      return {
        success: true,
        data: response,
      };
    } catch (error: any) {
      return {
        success: false,
        error,
      };
    }
  };
};