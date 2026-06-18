
  import {
  PRESS_SHOP_SET_NOTIFICATIONS,
  PRESS_SHOP_SET_NOTIFICATIONS_LOADING,
} from "../ActionTypes/NotificationActionTypes";

export const setNotifications = (list) => ({
  type: PRESS_SHOP_SET_NOTIFICATIONS,
  payload: list,
});
export const setNotificationsLoading = (val) => ({
  type: PRESS_SHOP_SET_NOTIFICATIONS_LOADING,
  payload: val,
});
