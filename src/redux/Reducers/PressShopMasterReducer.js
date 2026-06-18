import _ from "lodash";
import {
  PRESS_SHOP_ADD_MASTER_FILE,
  PRESS_SHOP_ADD_MASTER_FILE_API_STATUS,
  PRESS_SHOP_SET_APPROVED,
  PRESS_SHOP_SET_MASTER_FILES,
  PRESS_SHOP_SET_MASTER_LOADING,
  PRESS_SHOP_SET_UPLOAD_MASTER_LOADING,
} from "../ActionTypes/MasterActionTypes";

export default function PressShopMasterReducer(
  state = {
    loading: true,
    uploadLoading: false,
    data: [],
    approvedFile: {},
    addMasterApiStatus: "NOT IN USE",
  },
  action = {}
) {
  switch (action.type) {
    case PRESS_SHOP_SET_MASTER_FILES: {
      return {
        ...state,
        data: action.payload,
      };
    }
    case PRESS_SHOP_SET_MASTER_LOADING: {
      return {
        ...state,
        loading: action.payload,
      };
    }
    case PRESS_SHOP_SET_UPLOAD_MASTER_LOADING: {
      return {
        ...state,
        uploadLoading: action.payload,
      };
    }
    case PRESS_SHOP_SET_APPROVED: {
      return {
        ...state,
        approvedFile: action.payload,
      };
    }
    case PRESS_SHOP_ADD_MASTER_FILE_API_STATUS: {
      return {
        ...state,
        addMasterApiStatus: action.payload,
      };
    }

    case PRESS_SHOP_ADD_MASTER_FILE: {
      let files = state.data;
      if (files.length > 0) {
        files.splice(1, 0, action.payload);
      } else {
        files[0] = action.payload;
      }
      return {
        ...state,
        data: files,
      };
    }
    default:
      return state;
  }
}

export function getMasterFiles(state) {
  return _.get(state, ["PressShopMasterReducer", "data"], []);
}
export function getApprovedFile(state) {
  return _.get(state, ["PressShopMasterReducer", "approvedFile"], {});
}
export function getMasterFilesStatus(state) {
  return _.get(state, ["PressShopMasterReducer", "loading"], true);
}
export function getMasterUploadStatus(state) {
  return _.get(state, ["PressShopMasterReducer", "uploadLoading"], false);
}
export const getAddMasterApiStatus = (state) => {
  return _.get(
    state,
    ["PressShopMasterReducer", "addMasterApiStatus"],
    "NOT IN USE"
  );
};
