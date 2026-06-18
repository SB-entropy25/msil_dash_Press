
  import {
  PRESS_SHOP_FILTERS,
  PRESSSHOP_DOWNLOAD_HISTORY,
  PRESSSHOP_DOWNLOAD_HISTORY_LOADING,
} from "../ActionTypes/FiltersActionTypes";

export const setFilters = (list) => ({
  type: PRESS_SHOP_FILTERS,
  payload: list,
});
//
export const setDownloadHistoryReportId = (data) => ({
  type: PRESSSHOP_DOWNLOAD_HISTORY,
  payload: data,
});
export const setDownloadHistoryReportIdLoading = (data) => ({
  type: PRESSSHOP_DOWNLOAD_HISTORY_LOADING,
  payload: data,
});
