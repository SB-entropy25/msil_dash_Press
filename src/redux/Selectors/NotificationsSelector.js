import { createSelector } from "reselect";

const selectNotificationsReducer = (state) =>
  state.PressShopNotificationsReducer;

export const selectNotifications = createSelector(
  [selectNotificationsReducer],
  (notificationsReducer) => notificationsReducer?.notifications
);

export const selectNotificationsLoading = createSelector(
  [selectNotificationsReducer],
  (notificationsReducer) => notificationsReducer?.loading
);
