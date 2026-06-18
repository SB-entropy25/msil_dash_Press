import { baseClient } from "./BaseRepository";

export const getSAPProduction = (payload) => {
  let path = `pressShop/sap-logs/production?`;
  Object.keys(payload).forEach((key) => {
    if (payload[key]) {
      path = path + `${key}=${payload[key]}&`;
    }
  });
  path = path.substring(0, path.length - 1);
  return baseClient.get(path);
};

export const getSAPProductionPassRate = (payload) => {
  let path = `pressShop/sap-logs/production/pass-rate?`;
  Object.keys(payload).forEach((key) => {
    if (payload[key]) {
      path = path + `${key}=${payload[key]}&`;
    }
  });
  path = path.substring(0, path.length - 1);
  return baseClient.get(path);
};

export const downloadSAPProduction = (payload, options) => {
  let path = `pressShop/sap-logs/production/report?`;
  Object.keys(payload).forEach((key) => {
    if (payload[key]) {
      path = path + `${key}=${payload[key]}&`;
    }
  });
  path = path.substring(0, path.length - 1);
  return baseClient.get(path, options);
};

export const getSAPProductionFilters = (id) => {
  var path = `pressShop/sap-logs/production/filters?iot_shop_id=${id}`;
  return baseClient.get(path);
};

export const updateManualEditRepushApi = (endpoint, payload = {}) => {
  const path = `pressShop/sap-logs/production/${endpoint}`;
  return baseClient.post(path, payload);
};
