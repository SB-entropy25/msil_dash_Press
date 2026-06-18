
  import {
  PRESS_SHOP_ADD_MASTER_FILE,
  PRESS_SHOP_ADD_MASTER_FILE_API_STATUS,
  PRESS_SHOP_SET_APPROVED,
  PRESS_SHOP_SET_MASTER_LOADING,
  PRESS_SHOP_SET_MASTER_FILES,
  PRESS_SHOP_SET_UPLOAD_MASTER_LOADING,
} from "../ActionTypes/MasterActionTypes";

export const setMasterFiles = (list) => ({
  type: PRESS_SHOP_SET_MASTER_FILES,
  payload: list,
});

export const setLoading = (val) => ({
  type: PRESS_SHOP_SET_MASTER_LOADING,
  payload: val,
});

export const setUploadLoading = (val) => ({
  type: PRESS_SHOP_SET_UPLOAD_MASTER_LOADING,
  payload: val,
});

export const setApproved = (file) => ({
  type: PRESS_SHOP_SET_APPROVED,
  payload: file,
});

export const addMasterFile = (file) => ({
  type: PRESS_SHOP_ADD_MASTER_FILE,
  payload: file[0],
});

export const setAddMasterApiStatus = (data) => ({
  type: PRESS_SHOP_ADD_MASTER_FILE_API_STATUS,
  payload: data,
});
