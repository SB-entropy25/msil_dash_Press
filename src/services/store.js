import { applyMiddleware, compose, createStore } from "redux";
import { thunk } from "redux-thunk"; // Use named export
import RootReducer from "../redux/Reducers/RootReducer";

const initialState = {};
const middleware = [thunk];

// Use Redux DevTools if available
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  RootReducer,
  initialState,
  composeEnhancers(applyMiddleware(...middleware))
);

export default store;
