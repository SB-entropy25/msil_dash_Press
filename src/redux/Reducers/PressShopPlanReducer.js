
  import {
  PRESS_SHOP_SET_PLAN_ALERTS,
  PRESS_SHOP_SET_PLAN_ALERTS_LOADING,
  PRESS_SHOP_SET_PLAN_STATUS,
} from "../ActionTypes/PlanActionTypes";
import { planStatusInitialState } from "../initialStates";

export default function PressShopPlanReducer(
  state = {
    uploadingStatus: "IDLE",
    alerts: planStatusInitialState,
    alertsLoading: "INPROGRESS",
  },
  action = {}
) {
  switch (action.type) {
    case PRESS_SHOP_SET_PLAN_STATUS: {
      return {
        ...state,
        uploadingStatus: action.payload,
      };
    }
    case PRESS_SHOP_SET_PLAN_ALERTS: {
      return {
        ...state,
        alerts: action.payload,
      };
    }
    case PRESS_SHOP_SET_PLAN_ALERTS_LOADING: {
      return {
        ...state,
        alertsLoading: action.payload,
      };
    }
    default:
      return state;
  }
}
