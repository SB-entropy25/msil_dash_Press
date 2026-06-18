import { createSelector } from "reselect";

const selectDowntimeReducer = (state) => state.PressShopDowntimeReducer;

export const selectDowntimeTotalStopTime = createSelector(
  [selectDowntimeReducer],
  (DowntimeReducer) => DowntimeReducer?.totalStopTime
);

export const selectDowntimeRemarks = createSelector(
  [selectDowntimeReducer],
  (DowntimeReducer) => DowntimeReducer?.remarks
);
