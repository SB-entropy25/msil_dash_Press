import { baseClient } from "./BaseRepository";

export function loginApi(payload) {
  var path = "user/login";
  return baseClient.post(path, payload);
}
