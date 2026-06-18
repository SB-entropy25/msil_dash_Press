
  import { baseClient } from "./BaseRepository";

export const fetchFilters = (payload, id) => {
  const path = `/pressShop/${payload}/filters?shop_id=${id}`;
  return baseClient.get(path);
};
//Download history api
export function fetchDownloadHistory(payload) {
  var path = `pressShop/retrieval/reports/download/initiated?shop_id=${payload?.shop_id}&table=${payload?.table}&module=${payload?.module}&start_date=${payload?.start_date}&end_date=${payload?.end_date}`;
  return baseClient.get(path);
}
export function downloadInProgress(payload) {
  var path = `pressShop/retrieval/reports/download/athena?shop_id=${payload?.shop_id}&module=${payload?.module}&table=${payload?.table}&start_date=${payload?.start_date}&end_date=${payload?.end_date}&report_id=${payload?.report_id}`;
  return baseClient.get(path);
}
//fetch status of downloading
export function downloadStatus(payload) {
  var path = `pressShop/retrieval/reports/check/download/status?shop_id=${payload?.shop_id}&report_id=${payload?.report_id}&module=${payload?.module}`;
  return baseClient.get(path);
}
