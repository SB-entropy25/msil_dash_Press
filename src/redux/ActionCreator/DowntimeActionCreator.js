
  import {
  PRESS_SHOP_DOWNTIME_STOP_TIME,
  PRESS_SHOP_REMARKS,
} from "../ActionTypes/DowntimeActionTypes";

export const setStopTime = (val) => ({
  type: PRESS_SHOP_DOWNTIME_STOP_TIME,
  payload: val,
});
export const setRemarks = (val) => ({
  type: PRESS_SHOP_REMARKS,
  payload: val,
});
