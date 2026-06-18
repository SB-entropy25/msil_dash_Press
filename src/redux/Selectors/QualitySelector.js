import { createSelector } from "reselect";

const selectQualityReducer = (state) => state.PressShopQualityReducer;

export const selectReasons = createSelector(
  [selectQualityReducer],
  (qualityReducer) => qualityReducer?.reasons
);
export const selectTotalRework = createSelector(
  [selectQualityReducer],
  (qualityReducer) => qualityReducer?.total
);

export const selectTotalPendingRework = createSelector(
  [selectQualityReducer],
  (qualityReducer) => qualityReducer?.pending_rework_qty
);
