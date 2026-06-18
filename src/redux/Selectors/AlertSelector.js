import { createSelector } from "reselect";

const selectAlertReducer = (state) => state.PressShopAlertReducer;

export const selectAlert = createSelector(
  [selectAlertReducer],
  (alertReducer) => alertReducer.alert
);
