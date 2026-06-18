
  import _ from "lodash";
import { fetchMachines } from "../../Repository/ProductionRepository";
import { setMachines } from "../ActionCreator/ProductionActionCreator";
import { setApplicationAlert } from "./AlertActions";

export const fetchAllMachines = (id) => async (dispatch) => {
  try {
    const res = await fetchMachines(id);
    const data = _.get(res, ["data"], []);
    dispatch(setMachines(data));
  } catch (ex) {
    dispatch(setMachines([]));
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
