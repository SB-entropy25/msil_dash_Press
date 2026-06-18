
  import {
  PRESS_SHOP_FILTERS_CHANGED,
  PRESS_SHOP_REFRESHED,
  PRESS_SHOP_SET_LOADING,
  PRESS_SHOP_SET_LOCATION,
  PRESS_SHOP_SET_PLANT,
  PRESS_SHOP_SET_SHOP,
  PRESS_SHOP_SET_SITE,
  PRESS_SHOP_SET_SITES,
} from "../ActionTypes/ShopActionTypes";

export const setSites = (list) => ({
  type: PRESS_SHOP_SET_SITES,
  payload: list,
});

export const setShop = (data) => ({
  type: PRESS_SHOP_SET_SHOP,
  payload: data,
});
export const setPlant = (data) => ({
  type: PRESS_SHOP_SET_PLANT,
  payload: data,
});
export const setLocation = (data) => ({
  type: PRESS_SHOP_SET_LOCATION,
  payload: data,
});
export const setSite = (data) => ({
  type: PRESS_SHOP_SET_SITE,
  payload: data,
});

export const setLoading = (val) => ({
  type: PRESS_SHOP_SET_LOADING,
  payload: val,
});

export const setFiltersChanged = (val) => ({
  type: PRESS_SHOP_FILTERS_CHANGED,
  payload: val,
});
// export const setRefresh = (val) => ({
//   type: PRESS_SHOP_REFRESHED,
//   payload: val,
// });
