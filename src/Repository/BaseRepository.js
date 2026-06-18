import axios from "axios";
import Config from "../utils/config";
// import { addInterceptors } from "../../../utilities/helperFunctions/api";

import { getBearerToken } from "../services/auth";
import { setSessionExpired } from "../redux/Actions/SessionActions";

axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

export const addInterceptors = (client) => {
  client.interceptors.request.use(
    (config) => {
      const token = getBearerToken();
      if (token) {
        config.headers["Content-Type"] = "application/json";
        config.headers["Authorization"] = token;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  client.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error?.response?.status === 401) {
        const originalRequest = error?.config;
        const refreshed = localStorage.getItem("refreshed");
        if (refreshed && !originalRequest._retry) {
          originalRequest._retry = true;
          const token = getBearerToken();
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return client(originalRequest);
        } else {
          // setSessionExpired();
        }
      }
      return Promise.reject(error);
    }
  );
};

const baseClient = axios.create({
  baseURL: Config.PRESS_ENDPOINT,
});

const platformClient = axios.create({
  baseURL: Config.USER_ENDPOINT,
});

addInterceptors(baseClient);
addInterceptors(platformClient);

export { baseClient, platformClient };
