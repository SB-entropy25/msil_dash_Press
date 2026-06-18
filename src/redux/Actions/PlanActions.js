
  import _ from "lodash";
import { getPlanStatus } from "../../Repository/PlanRepository";
import {
  setPlanAlerts,
  setPlanAlertsLoading,
  setPlanStatus,
} from "../ActionCreator/PlanActionCreator";
import { planStatusInitialState } from "../initialStates";
import { setApplicationAlert } from "./AlertActions";

export const setUploadPlanStatus = (payload) => async (dispatch) => {
  dispatch(setPlanStatus(payload));
};

export const fetchPlanAlerts =
  (payload, dispatchApiStatus = true) =>
  async (dispatch) => {
    dispatch(setPlanAlerts(planStatusInitialState));
    try {
      if (dispatchApiStatus) {
        dispatch(setPlanAlertsLoading(true));
      }
      const res = await getPlanStatus(payload);
      const data = _.get(res, ["data"], {});
      dispatch(setPlanAlerts(data));
      if (dispatchApiStatus) {
        dispatch(setPlanAlertsLoading(false));
      }
    } catch (ex) {
      if (dispatchApiStatus) {
        dispatch(setPlanAlerts(planStatusInitialState));
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
        dispatch(setPlanAlertsLoading(false));
      }
    }
  };
