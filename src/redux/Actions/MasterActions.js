
  import _ from "lodash";

import {
  setAddMasterApiStatus,
  setApproved,
  setLoading,
  setMasterFiles,
  setUploadLoading,
} from "../ActionCreator/MasterActionCreator";

import {
  fetchMasterData,
  saveDetails,
  uploadMaster,
} from "../../Repository/MasterRepository";
import { setApplicationAlert } from "./AlertActions";

export const fetchAllMasterFiles =
  (payload, dispatchApiStatus = true) =>
  async (dispatch) => {
    try {
      if (dispatchApiStatus) {
        dispatch(setLoading(true));
      }
      const res = await fetchMasterData(payload);
      const files = _.get(res, ["data"], [])||[];
      let filtered = files?.filter((x) => x?.file_status === "APPROVED")[0];
      dispatch(setApproved(filtered));
      dispatch(setMasterFiles(files));
      if (dispatchApiStatus) {
        dispatch(setLoading(false));
      }
    } catch (ex) {
      if (dispatchApiStatus) {
        dispatch(setMasterFiles([]));
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
        dispatch(setLoading(false));
      }
    }
  };
export const changeMasterApiStatus = (status) => async (dispatch) => {
  dispatch(setLoading(status));
};
export const changeAddMasterApiStatus = (status) => async (dispatch) => {
  dispatch(setAddMasterApiStatus(status));
};
export const uploadMasterFile =
  (payload, dispatchApiStatus = true) =>
  async (dispatch) => {
    try {
      if (dispatchApiStatus) {
        dispatch(setAddMasterApiStatus("INPROGRESS"));
      }
      const res = await uploadMaster(payload);
      const data = _.get(res, ["data", "response"], {});
      payload.file_name = data.filename;
      payload.file_path = data.filepath;
      try {
        const response = await saveDetails(payload);
        const result = _.get(response, ["data", "response"], {});
        if (result) {
          dispatch(fetchAllMasterFiles(payload));
        }
        if (dispatchApiStatus) {
          dispatch(setAddMasterApiStatus("COMPLETED"));
          const params = {
            open: true,
            message: "Master upload in progress. Please refresh after sometime",
            type: "WAITING",
          };
          dispatch(setApplicationAlert(params));
        }
      } catch (ex) {
        if (dispatchApiStatus) {
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
          dispatch(setUploadLoading(false));
          dispatch(setAddMasterApiStatus("FAILED"));
        }
      }
    } catch (ex) {
      if (dispatchApiStatus) {
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
        dispatch(setUploadLoading(false));
        dispatch(setAddMasterApiStatus("FAILED"));
      }
    }
  };
