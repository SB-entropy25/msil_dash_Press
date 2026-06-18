
  import _ from "lodash";
import {
  PRESS_SHOP_SHOPVIEW_MACHINE_LIST,
  PRESS_SHOP_SHOPVIEW_STATUS_ACHIEVEMENT,
} from "../ActionTypes/ShopViewActionType";

export default function PressShopShopViewReducer(
  state = { status: {} },
  action = {}
) {
  switch (action.type) {
    case PRESS_SHOP_SHOPVIEW_STATUS_ACHIEVEMENT: {
      return {
        ...state,
        status: action.payload?.statu,
        achieved: action.payload?.achieved,
      };
    }
    case PRESS_SHOP_SHOPVIEW_MACHINE_LIST: {
      return {
        ...state,
        machineList: action.payload,
      };
    }
    default:
      return state;
  }
}
