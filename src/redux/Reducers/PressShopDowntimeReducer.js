
  import _ from "lodash";
import {
  PRESS_SHOP_DOWNTIME_STOP_TIME,
  PRESS_SHOP_REMARKS,
} from "../ActionTypes/DowntimeActionTypes";

export default function PressShopDowntimeReducer(
  state = { totalStopTime: 0, remarks: [] },
  action = {}
) {
  switch (action.type) {
    case PRESS_SHOP_DOWNTIME_STOP_TIME: {
      return {
        ...state,
        totalStopTime: action.payload,
      };
    }
    case PRESS_SHOP_REMARKS: {
      return {
        ...state,
        remarks: action.payload,
      };
    }
    default:
      return state;
  }
}
