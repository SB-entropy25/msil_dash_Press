import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import React, { Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LandingScreen from "../tabs/Container/Container";
import Login from "../components/Login/Login";
import Navigation from "../components/Navigation/Navigation";
import Dashboard from "../tabs/Container/Container";
import { ProdigiTheme } from "../utils/theme/theme";
import PrivateRoute from "./PrivateRoute";
// import { ShiftProvider } from "./ShiftContext";

const AppRoutes = () => {
  return (
    <ThemeProvider theme={ProdigiTheme}>
      <Router>
        <Suspense
          fallback={
            <Backdrop
              open={true}
              sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          }
        >
          <Navigation />
          <Routes>
            <Route exact path="/" element={<LandingScreen />} />
            <Route
              exact
              path="/Prodigi"
              element={
                <PrivateRoute>
                  {/* <ShiftProvider> */}
                  <Dashboard />
                  {/* </ShiftProvider> */}
                </PrivateRoute>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
};
export default AppRoutes;
