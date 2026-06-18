
  import _ from "lodash";
import {
  PRESS_SHOP_MACHINES,
} from "../ActionTypes/ProductionActionTypes";

export default function PressShopProductionReducer(
  state = { machines: [], machine: { id: "", value: "" } },
  action = {}
) {
  switch (action.type) {
    case PRESS_SHOP_MACHINES: {
      return {
        ...state,
        machines: action.payload,
      };
    }
    default:
      return state;
  }
}
