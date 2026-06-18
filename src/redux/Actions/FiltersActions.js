
  import _ from "lodash";
import { fetchDownloadHistory, fetchFilters } from "../../Repository/FiltersRepository";
import { setDownloadHistoryReportId, setDownloadHistoryReportIdLoading, setFilters } from "../ActionCreator/FiltersActionCreator";

import { getFiltersObject } from "../helper";
import { setApplicationAlert } from "./AlertActions";

export const fetchAllFilters = (payload, id) => async (dispatch) => {
  try {
    const res = await fetchFilters(payload, id);
    const filters = _.get(res, ["data"], []);
    dispatch(setFilters(getFiltersObject(payload, filters)));
  } catch (ex) {
    dispatch(setFilters(getFiltersObject(payload, [])));
    let message = "";
    if (ex?.response?.status === 409) {
      message = ex?.response?.data?.message;
    } else {
      message = ex?.message;
    }
    const params = {
      open: true,
      message: message,
      type: "ERROR",
    };
    dispatch(setApplicationAlert(params));
  }
};
//
export const getDownloadHistory = (payload) => async (dispatch) => {
  dispatch(setDownloadHistoryReportIdLoading(true));
  try {
    const res = await fetchDownloadHistory(payload);
    const data = _.get(res, ["data"], {});
    dispatch(setDownloadHistoryReportId(data));
    dispatch(setDownloadHistoryReportIdLoading(false));
  } catch (ex) {
    dispatch(setDownloadHistoryReportId({}));
    dispatch(setDownloadHistoryReportIdLoading(false));
    let message = "";
    if (ex?.response?.status === 409) {
      message = ex?.response?.data?.message;
    } else {
      message = ex?.message;
    }
    message = "Report Download: " + message;
    const params = {
      open: true,
      message: message,
      type: "ERROR",
    };
    dispatch(setApplicationAlert(params));
  }
};