import { baseClient } from "./BaseRepository";

export const getSAPMaster = (payload) => {
  let path = `pressShop/sap-logs/master?`;
  Object.keys(payload).forEach((key) => {
    if (payload[key]) {
      path = path + `${key}=${payload[key]}&`;
    }
  });
  path = path.substring(0, path.length - 1);
  return baseClient.get(path);
};

export const downloadSAPMaster = (payload, options) => {
  let path = `pressShop/sap-logs/master/report?`;
  Object.keys(payload).forEach((key) => {
    if (payload[key]) {
      path = path + `${key}=${payload[key]}&`;
    }
  });
  path = path.substring(0, path.length - 1);
  return baseClient.get(path, options);
};
