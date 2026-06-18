
  import { PRESS_SHOP_MACHINES } from "../ActionTypes/ProductionActionTypes";

export const setMachines = (list) => ({
  type: PRESS_SHOP_MACHINES,
  payload: list,
});
