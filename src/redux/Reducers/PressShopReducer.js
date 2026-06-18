import _ from "lodash";
import {
  PRESS_SHOP_FILTERS_CHANGED,
  PRESS_SHOP_SET_LOADING,
  PRESS_SHOP_SET_LOCATION,
  PRESS_SHOP_SET_PLANT,
  PRESS_SHOP_SET_SHOP,
  PRESS_SHOP_SET_SITE,
  PRESS_SHOP_SET_SITES,
} from "../ActionTypes/ShopActionTypes";

export default function PressShopReducer(
  state = {
    loading: true,
    filtersChanged: false,
    sites: undefined,
    shop: {},
    location: {},
    plant: {},
    site: {},
  },
  action = {}
) {
  switch (action.type) {
    case PRESS_SHOP_SET_SITES: {
      return {
        ...state,
        sites: action.payload,
      };
    }
    case PRESS_SHOP_SET_SHOP: {
      return {
        ...state,
        shop: action.payload,
      };
    }
    case PRESS_SHOP_SET_SITE: {
      return {
        ...state,
        site: action.payload,
      };
    }
    case PRESS_SHOP_SET_PLANT: {
      return {
        ...state,
        plant: action.payload,
      };
    }
    case PRESS_SHOP_SET_LOCATION: {
      return {
        ...state,
        location: action.payload,
      };
    }
    case PRESS_SHOP_SET_LOADING: {
      return {
        ...state,
        loading: action.payload,
      };
    }
    case PRESS_SHOP_FILTERS_CHANGED: {
      return {
        ...state,
        filtersChanged: action.payload,
      };
    }
    default:
      return state;
  }
}

export function getAllSites(state) {
  return _.get(state, ["PressShopReducer", "sites"], undefined);
}
export function getShop(state) {
  return _.get(state, ["PressShopReducer", "shop"], {});
}
export function getPlant(state) {
  return _.get(state, ["PressShopReducer", "plant"], {});
}
export function getLocation(state) {
  return _.get(state, ["PressShopReducer", "location"], {});
}
export function getSite(state) {
  return _.get(state, ["PressShopReducer", "site"], {});
}
export function getLoading(state) {
  return _.get(state, ["PressShopReducer", "loading"], true);
}
export function getFiltersChangeStatus(state) {
  return _.get(state, ["PressShopReducer", "filtersChanged"], false);
}
