
  import _ from "lodash";
import { getReasonsObject } from "../helper";
import { getReasons, getTotalRework } from "../../Repository/QualityRepository";
import {
  setReasons,
  setTotalRework,
  setTotalPendingRework,
} from "../ActionCreator/QualityActionCreator ";
import { reasonsInitialState } from "../initialStates";
import { setApplicationAlert } from "./AlertActions";

export const fetchReasons = (payload) => async (dispatch) => {
  try {
    const res = await getReasons(payload);
    const data = _.get(res, ["data"], {});
    dispatch(setReasons(getReasonsObject(payload?.for_rework, data)));
  } catch (ex) {
    dispatch(
      setReasons(
        getReasonsObject(payload?.for_rework, reasonsInitialState?.UPDATION)
      )
    );
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
export const fetchTotalRework = (payload) => async (dispatch) => {
  try {
    const res = await getTotalRework(payload);
    const data = _.get(res, ["data"], {});
    if (Object.keys(data).length) {
      dispatch(setTotalRework(data?.total_rework_Qty));
      dispatch(setTotalPendingRework(data?.total_pending_rework_qty));
    }
  } catch (ex) {
    dispatch(setTotalRework(0));
    dispatch(setTotalPendingRework(0));
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
