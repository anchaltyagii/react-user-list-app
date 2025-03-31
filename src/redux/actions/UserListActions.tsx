import * as service from '../services/UserListServices';
import * as actionTypes from '../ActionTypes';
import { Dispatch } from 'redux';

export const getUserList = () => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(ACTION_CREATOR(actionTypes.IS_LOADING, true));
      
      const response = await service.UserListServices.getUsers();
      
      if (response) {
        dispatch(ACTION_CREATOR(actionTypes.IS_LOADING, false));
        dispatch(ACTION_CREATOR(actionTypes.USER_LIST_DATA, response));
      }
    } catch (error) {
      dispatch(ACTION_CREATOR(actionTypes.IS_LOADING, false));
      dispatch(ACTION_CREATOR(actionTypes.ERROR, 'Failed to fetch users'));
    }
  };
};

export function ACTION_CREATOR(type: string, payload: any) {
  return { type, payload };
}
