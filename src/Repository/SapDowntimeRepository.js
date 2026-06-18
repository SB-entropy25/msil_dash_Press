import { baseClient } from "./BaseRepository";

export const getSAPDowntime = (payload) => {
  let path = `pressShop/sap-logs/downtime?`;
  Object.keys(payload).forEach((key) => {
    if (payload[key]) {
      path = path + `${key}=${payload[key]}&`;
    }
  });
  path = path.substring(0, path.length - 1);
  return baseClient.get(path);
};

export const downloadSAPDowntime = (payload, options) => {
  let path = `pressShop/sap-logs/downtime/report?`;
  Object.keys(payload).forEach((key) => {
    if (payload[key]) {
      path = path + `${key}=${payload[key]}&`;
    }
  });
  path = path.substring(0, path.length - 1);
  return baseClient.get(path, options);
};

export const getSAPDowntimeFilters = (id) => {
  var path = `pressShop/sap-logs/downtime/filters?iot_shop_id=${id}`;
  return baseClient.get(path);
};
