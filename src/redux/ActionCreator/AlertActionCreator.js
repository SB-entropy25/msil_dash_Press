import { PRESS_SHOP_ALERT } from "../ActionTypes/AlertActionTypes";

export const setAlertObject = (object) => ({
  type: PRESS_SHOP_ALERT,
  payload: object,
});
