import { createSelector } from "reselect";

const selectShopViewReducer = (state) => state.PressShopShopViewReducer;

export const selectshopVewStatus = createSelector(
  [selectShopViewReducer],
  (shopviewReducer) => shopviewReducer
);
