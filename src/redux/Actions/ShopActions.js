import _ from "lodash";
import * as shopRepository from "../../Repository/ShopRepository";

import {
  setSites,
  setShop,
  setLocation,
  setSite,
  setPlant,
  setLoading,
  setFiltersChanged,
} from "../ActionCreator/ShopActionCreator";

export const setShopDetails =
  (site, location, plant, shop) => async (dispatch) => {
    dispatch(setSite(site));
    dispatch(setLocation(location));
    dispatch(setPlant(plant));
    dispatch(setShop(shop));
  };
export const fetchAllSites =
  (dispatchApiStatus = true) =>
  async (dispatch) => {
    try {
      if (dispatchApiStatus) {
        dispatch(setLoading(true));
      }
      const res = await shopRepository.fetchSiteDetails();
      const list = _.get(res, ["data", "response"], []);
      dispatch(setSites(list));
      if (dispatchApiStatus) {
        dispatch(setLoading(false));
      }
    } catch (ex) {
      if (dispatchApiStatus) {
        dispatch(setLoading(false));
      }
    }
  };

export const changeFilterChangeStatus = (status) => async (dispatch) => {
  dispatch(setFiltersChanged(status));
};
