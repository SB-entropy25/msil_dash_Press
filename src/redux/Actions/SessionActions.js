import Store from "../../services/store";

const SESSION_EXPIRED = "SESSION_EXPIRED";

const { dispatch } = Store;

export const setSessionExpired = (expired = true) => {
  dispatch({
    type: SESSION_EXPIRED,
    payload: expired,
  });
};
