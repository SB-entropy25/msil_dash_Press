
  import { baseClient } from "./BaseRepository";

export const fetchNotifications = (payload) => {
  var path = `/pressShop/alerts?shop_id=${payload}`;
  return baseClient.get(path);
};
