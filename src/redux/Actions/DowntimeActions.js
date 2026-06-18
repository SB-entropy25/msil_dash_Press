import _ from "lodash";
import {
  fetchDowntimeStopTime,
  getRemarkList,
} from "../../Repository/DowntimeRepository";
import {
  setRemarks,
  setStopTime,
} from "../ActionCreator/DowntimeActionCreator";
import { setApplicationAlert } from "./AlertActions";

export const fetchStopTime = (payload) => async (dispatch) => {
  try {
    const res = await fetchDowntimeStopTime(payload);
    const data = _.get(res, ["data"], "");
    dispatch(setStopTime(data));
  } catch (ex) {
    dispatch(setStopTime("0"));
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
export const fetchRemarks = (payload) => async (dispatch) => {
  try {
    const res = await getRemarkList(payload);
    const data = _.get(res, ["data"], []);
    dispatch(setRemarks(data));
  } catch (ex) {
    dispatch(setRemarks([]));
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
