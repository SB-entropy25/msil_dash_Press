
  import {
  PRESS_SHOP_SET_PLAN_ALERTS,
  PRESS_SHOP_SET_PLAN_ALERTS_LOADING,
  PRESS_SHOP_SET_PLAN_STATUS,
} from "../ActionTypes/PlanActionTypes";

export const setPlanStatus = (val) => ({
  type: PRESS_SHOP_SET_PLAN_STATUS,
  payload: val,
});

export const setPlanAlerts = (val) => ({
  type: PRESS_SHOP_SET_PLAN_ALERTS,
  payload: val,
});
export const setPlanAlertsLoading = (val) => ({
  type: PRESS_SHOP_SET_PLAN_ALERTS_LOADING,
  payload: val,
});
