
  import _ from "lodash";
import { reasonsInitialState } from "../initialStates";
import {
  PRESS_SHOP_QUALITY_PENDING_TOTAL_REWORK,
  PRESS_SHOP_QUALITY_REASONS,
  PRESS_SHOP_QUALITY_TOTAL_REWORK,
} from "../ActionTypes/QualityActionTypes";

export default function PressShopQualityReducer(
  state = { reasons: reasonsInitialState, total: 0 },
  action = {}
) {
    switch (action.type) {
    case PRESS_SHOP_QUALITY_REASONS: {
      const reasons = state.reasons;
      reasons[action.payload.name] = action.payload.values;
      return {
        ...state,
        reasons: { ...reasons },
      };
    }
    case PRESS_SHOP_QUALITY_TOTAL_REWORK: {
      return {
        ...state,
        total: action.payload,
      };
    }
    case PRESS_SHOP_QUALITY_PENDING_TOTAL_REWORK: {
      return {
        ...state,
        pending_rework_qty: action.payload,
      };
    }
    default:
      return state;
  }
}
