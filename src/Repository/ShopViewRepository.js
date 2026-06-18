
  
import { baseClient } from "./BaseRepository";

export const getShopViw = (payload) => {
  const {
    view,
    shop_id,
    machine_group,
    machine_name,
    page_no = 1,
    page_size = 20,
  } = payload;
  var path = `/pressShop/shop-view?shop_id=${shop_id}&page_no=${page_no}&page_size=${page_size}`;
  if (view) {
    path += `&view=${view}`;
  }
  if (machine_group) {
    path += `&machine_group=${machine_group}`;
  }
  if (machine_name) {
    path += `&machine_name=${machine_name}`;
  }

  return baseClient.get(path);
};


export const downloadshopView = (payload, options) => {
  const {
    view,
    shop_id,
    machine_group,
    machine_name,
  } = payload;
  var path = `/pressShop/shop-view/report?shop_id=${shop_id}`;
  if (view) {
    path += `&view=${view}`;
  }
  if (machine_group) {
    path += `&machine_group=${machine_group}`;
  }
  if (machine_name) {
    path += `&machine_name=${machine_name}`;
  }
  return baseClient.get(path, options);
};

export const graphFetchAPI = (payload, options) => {
  const {
    view,
    shop_id,
    machine_group,
    machine_name,
  } = payload;
  var path = `/pressShop/shop-view/graph?shop_id=${shop_id}`;
  if (view) {
    path += `&view=${view}`;
  }
  if (machine_group) {
    path += `&machine_group=${machine_group}`;
  }
  if (machine_name) {
    path += `&machine_name=${machine_name}`;
  }
  return baseClient.get(path, options);
};

