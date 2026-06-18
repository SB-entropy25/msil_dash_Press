
  import { setAlertObject } from "../ActionCreator/AlertActionCreator";

export const setApplicationAlert = (val) => async (dispatch) => {
  dispatch(setAlertObject(val));
};
