
  import {
  PRESS_SHOP_FILTERS,
  PRESSSHOP_DOWNLOAD_HISTORY,
  PRESSSHOP_DOWNLOAD_HISTORY_LOADING,
} from "../ActionTypes/FiltersActionTypes";
import { filtersInitialState } from "../initialStates";

export default function PressShopFiltersReducer(
  state = {
    filters: filtersInitialState,
    historyData: {},
    historyDataLoading: false,
  },
  action = {}
) {
  switch (action.type) {
    case PRESS_SHOP_FILTERS: {
      const filters = state.filters;
      filters[action.payload.name] = action.payload.values;
      return {
        ...state,
        filters: { ...filters },
      };
    }
    case PRESSSHOP_DOWNLOAD_HISTORY: {
      return {
        ...state,
        historyData: action.payload,
      };
    }
    case PRESSSHOP_DOWNLOAD_HISTORY_LOADING: {
      return {
        ...state,
        historyDataLoading: action.payload,
      };
    }
    default:
      return state;
  }
}
