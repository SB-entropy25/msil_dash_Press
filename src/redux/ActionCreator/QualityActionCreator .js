
  import {
  PRESS_SHOP_QUALITY_PENDING_TOTAL_REWORK,
  PRESS_SHOP_QUALITY_REASONS,
  PRESS_SHOP_QUALITY_TOTAL_REWORK,
} from "../ActionTypes/QualityActionTypes";

export const setReasons = (list) => ({
  type: PRESS_SHOP_QUALITY_REASONS,
  payload: list,
});
export const setTotalRework = (data) => ({
  type: PRESS_SHOP_QUALITY_TOTAL_REWORK,
  payload: data,
});
export const setTotalPendingRework = (data) => ({
  type: PRESS_SHOP_QUALITY_PENDING_TOTAL_REWORK,
  payload: data,
});
