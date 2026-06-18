
  import {
  PRESS_SHOP_SHOPVIEW_MACHINE_LIST,
  PRESS_SHOP_SHOPVIEW_STATUS_ACHIEVEMENT,
} from "../ActionTypes/ShopViewActionType";

export const setStatus = (list) => ({
  type: PRESS_SHOP_SHOPVIEW_STATUS_ACHIEVEMENT,
  payload: list,
});

export const setMachineList = (list) => ({
  type: PRESS_SHOP_SHOPVIEW_MACHINE_LIST,
  payload: list,
});
