import { combineReducers } from "redux";
import PressShopAlertReducer from "./PressShopAlertReducer";
import PressShopFiltersReducer from "./PressShopFiltersReducer";
import PressShopNotificationsReducer from "./PressShopNotificationsReducer";
import PressShopPlanReducer from "./PressShopPlanReducer";
import PressShopDowntimeReducer from "./PressShopDowntimeReducer";
import PressShopQualityReducer from "./PressShopQualityReducer";
import PressShopProductionReducer from "./PressShopProductionReducer";
import PressShopShopViewReducer from "./PressShopShopViewReducer";
import PressShopMasterReducer from "./PressShopMasterReducer";
import PressShopReducer from "./PressShopReducer";
import SessionReducer from "./SessionReducer";

export default combineReducers({
  PressShopAlertReducer,
  PressShopReducer,
  PressShopFiltersReducer,
  PressShopNotificationsReducer,
  PressShopPlanReducer,
  PressShopDowntimeReducer,
  PressShopQualityReducer,
  PressShopProductionReducer,
  PressShopShopViewReducer,
  PressShopMasterReducer,
  SessionReducer,
});
