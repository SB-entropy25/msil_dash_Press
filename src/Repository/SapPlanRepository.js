import { baseClient } from "./BaseRepository";

export const getSAPPlan = (payload) => {
  let path = `pressShop/sap-logs/plan?`;
  Object.keys(payload).forEach((key) => {
    if (payload[key]) {
      path = path + `${key}=${payload[key]}&`;
    }
  });
  path = path.substring(0, path.length - 1);
  return baseClient.get(path);
};

export const downloadSAPPlan = (payload, options) => {
  let path = `pressShop/sap-logs/plan/report?`;
  Object.keys(payload).forEach((key) => {
    if (payload[key]) {
      path = path + `${key}=${payload[key]}&`;
    }
  });
  path = path.substring(0, path.length - 1);
  return baseClient.get(path, options);
};

export const getSAPPlanFilters = (id) => {
  var path = `pressShop/sap-logs/plan/filters?iot_shop_id=${id}`;
  return baseClient.get(path);
};
