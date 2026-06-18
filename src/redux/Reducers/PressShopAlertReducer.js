
  import _ from "lodash";
import {
  PRESS_SHOP_ALERT,
} from "../ActionTypes/AlertActionTypes";

const initialAlert = {
  open: false,
  message: "",
  type: "ERROR",
};
export default function PressShopAlertReducer(
  state = { isAlert: false, message: "", alert: initialAlert },
  action = {}
) {
  switch (action.type) {
    case PRESS_SHOP_ALERT: {
      return {
        ...state,
        alert: action.payload,
      };
    }
    default:
      return state;
  }
}
