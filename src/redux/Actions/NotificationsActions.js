
  import _ from "lodash";
import {
  setNotifications,
  setNotificationsLoading,
} from "../ActionCreator/NotificationsActionCreator";
import { fetchNotifications } from "../../Repository/NotificationsRepository";
import { setApplicationAlert } from "./AlertActions";

export const fetchAllNotifications =
  (payload, dispatchApiStatus = true) =>
  async (dispatch) => {
    try {
      if (dispatchApiStatus) {
        dispatch(setNotificationsLoading(true));
      }
      const res = await fetchNotifications(payload);
      const data = _.get(res, ["data"], []);
      dispatch(setNotifications(data));
      if (dispatchApiStatus) {
        dispatch(setNotificationsLoading(false));
      }
    } catch (ex) {
      if (dispatchApiStatus) {
        dispatch(setNotifications([]));
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
        dispatch(setNotificationsLoading(false));
      }
    }
  };
