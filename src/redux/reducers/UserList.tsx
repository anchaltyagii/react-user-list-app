import * as actionTypes from '../ActionTypes';

const initialState = {};

const userListReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.IS_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

export default userListReducer;
