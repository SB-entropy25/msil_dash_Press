import axios from "axios";
import { millisecondsToMinutes } from "date-fns";
import { jwtDecode } from "jwt-decode";
import config from "../utils/config";
import { setSessionExpired } from "../redux/Actions/SessionActions";

export const getBearerToken = () => {
  const bearerToken = localStorage.getItem("id_token");
  if (bearerToken !== null) {
    return bearerToken;
  } else {
    return null;
  }
};
export const getTokenActiveTime = () => {
  const tokenExpiry = new Date(localStorage.getItem("token_expiry")).getTime();
  if (tokenExpiry) {
    const today = new Date().getTime();

    const diff = tokenExpiry - today;
    const diffInMins = millisecondsToMinutes(diff);

    return diffInMins;
  }
  return null;
};

export const isTokenValid = (check = true) => {
  const checked = check && localStorage.getItem("check_session");
  const diff = getTokenActiveTime();

  return !checked && diff && diff > 0;
};

export const handleLogout = () => {
  setSessionExpired(false);
  localStorage.clear();
  window.location.href = "/";
};

export const logoutSession = () => {
  const token = localStorage.getItem("id_token");

  const options = {
    method: "post",
    baseURL: config.PRESS_ENDPOINT,
    url: "user/logout",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      Authorization: token,
    },
    data: {},
  };

  axios(options)
    .then(() => {
      handleLogout();
    })
    .catch(() => {
      handleLogout();
    });
};

export const getUser = () => {
  let user = null;
  const token = localStorage.getItem("id_token");
  if (token) {
    const decodedToken = jwtDecode(token);
    decodedToken.role = decodedToken["role"];
    decodedToken.username = decodedToken["federation_identifier"];
    decodedToken.tenant = decodedToken["tenant"];
    decodedToken.manager = decodedToken["manager"];
    decodedToken.managerId = decodedToken["managerId"];
    user = decodedToken;
    if (!user.role || !user.tenant) {
      user.role = "Admin";
      user.tenant = "MSIL";
    }
  }
  return user;
};

export const getAvailableShops = () => {
  let shops = null;
  const token = localStorage.getItem("id_token");
  if (token) {
    const decodedToken = jwtDecode(token);
    const filterAccess = decodedToken["role_permissions"]?.filter(
      (item) => item?.resource === "PSM_SHOP"
    );
    if (filterAccess?.length) {
      shops = filterAccess[0]?.scope?.ALLOWED_SHOP_IDS || [];
    }
  }
  return shops;
};

export const getDownloadShops = () => {
  let shops = null;
  const token = localStorage.getItem("id_token");
  if (token) {
    const decodedToken = jwtDecode(token);
    const filterAccess = decodedToken["role_permissions"]?.filter(
      (item) => item?.resource === "PSM_DOWNLOAD"
    );
    if (filterAccess?.length) {
      shops = filterAccess[0]?.scope?.ALLOWED_SHOP_IDS || [];
    }
  }
  return shops;
};
