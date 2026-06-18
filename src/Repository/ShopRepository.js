import { baseClient } from "./BaseRepository";

export function fetchSiteDetails() {
  var path = `/platform/sites?module_name=Press shop management`;
  return baseClient.get(path);
}
