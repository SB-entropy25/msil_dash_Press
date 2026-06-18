import { ThemeProvider } from "@mui/material/styles";
import { createGenerateClassName, StylesProvider } from "@mui/styles";
import { createContext } from "react";
import { Provider } from "react-redux";
import "./App.css";
import "./global_css/base.css";
import store from "./services/store";
import { ProdigiTheme } from "./utils/theme/theme";
import AppRoutes from "./routes";
import SessionExpired from "./components/SessionExpiredModal/SessionExpired";

export const ProdigiContext = createContext({});

function App({ initialState = {} }) {
  const generateClassName = createGenerateClassName({
    seed: "dev",
    productionPrefix: "prodigi",
    disableGlobal: true,
  });
  return (
    <StylesProvider generateClassName={generateClassName}>
      <ProdigiContext.Provider value={initialState}>
        <ThemeProvider theme={ProdigiTheme}>
          <Provider store={store}>
            <div className="prodigi">
              <SessionExpired />
              <AppRoutes />
            </div>
          </Provider>
        </ThemeProvider>
      </ProdigiContext.Provider>
    </StylesProvider>
  );
}

export default App;
