
  import _ from "lodash";
import {
  PRESS_SHOP_SET_NOTIFICATIONS,
  PRESS_SHOP_SET_NOTIFICATIONS_LOADING,
} from "../ActionTypes/NotificationActionTypes";

export default function PressShopNotificationsReducer(
  state = { notifications: [], loading: true },
  action = {}
) {
  switch (action.type) {
    case PRESS_SHOP_SET_NOTIFICATIONS: {
      return {
        ...state,
        notifications: action.payload,
      };
    }
    case PRESS_SHOP_SET_NOTIFICATIONS_LOADING: {
      return {
        ...state,
        loading: action.payload,
      };
    }
    default:
      return state;
  }
}
