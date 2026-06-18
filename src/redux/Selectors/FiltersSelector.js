import { createSelector } from "reselect";

const selectFiltersReducer = (state) => state.PressShopFiltersReducer;

export const selectFilters = createSelector(
  [selectFiltersReducer],
  (filterReducer) => filterReducer?.filters
);
//
export const selectHistoryReportId = createSelector(
  [selectFiltersReducer],
  (filterReducer) => filterReducer?.historyData
);
export const selectHistoryReportIdLoading = createSelector(
  [selectFiltersReducer],
  (filterReducer) => filterReducer?.historyDataLoading
);
