import _ from "lodash";

const initialState = {
  isSessionExpired: false,
  isDuplicateSession: false,
};

const SessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SESSION_EXPIRED":
      return {
        ...state,
        isSessionExpired: action.payload,
      };
    default:
      return state;
  }
};

export default SessionReducer;

export function getSessionStatus(state) {
  return _.get(state, ["SessionReducer", "isSessionExpired"]);
}
