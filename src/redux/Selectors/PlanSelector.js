import { createSelector } from "reselect";

const selectPlanReducer = (state) => state.PressShopPlanReducer;

export const selectPlanStatus = createSelector(
  [selectPlanReducer],
  (planReducer) => planReducer?.uploadingStatus
);

export const selectPlanAlerts = createSelector(
  [selectPlanReducer],
  (planReducer) => planReducer?.alerts
);
export const selectPlanAlertsLoading = createSelector(
  [selectPlanReducer],
  (planReducer) => planReducer?.alertsLoading
);
