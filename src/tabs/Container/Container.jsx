import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Box,
  CssBaseline,
  MenuItem,
  Skeleton,
  Tab,
  Typography,
} from "@mui/material";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "../../components/Select/SiteSelect";
import { setApplicationAlert } from "../../redux/Actions/AlertActions";
// import { fetchAllNotifications } from "../../redux/Actions/NotificationsActions";
import { fetchAllMachines } from "../../redux/Actions/ProductionActions";
import * as shopActions from "../../redux/Actions/ShopActions";
import * as shopReducer from "../../redux/Reducers/PressShopReducer";
import { getAvailableShops, getUser } from "../../services/auth";
import Downtime from "../../tabs/Downtime/Downtime";
import Master from "../../tabs/Masters/Master";
import Quality from "../../tabs/Quality/Quality";
import Plan from "../../tabs/Plan/Plan";
import Production from "../../tabs/Production/Production";
import Reports from "../../tabs/Reports/Reports";
import SapLogs from "../../tabs/SapLogs/SapLogs";
import MaterialInspection from "../../tabs/MaterialInspection/App";
import Shopview from "../../tabs/Shopview/Shopview";
import { MarutiSilverDark } from "../../utils/colors";
import {
  findPermittedShop,
  formatDateTime,
} from "../../utils/helperFunctions.utils";
import AlertContainer from "./AlertContainer";
import Alerts from "./Alerts/Alerts";
import useStyles from "./Container.styles";
import DownloadHistory from "./DownloadHistory/DownloadHistory";

const Dashboard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState("9");
  const sites = useSelector(shopReducer.getAllSites);
  const shop = useSelector(shopReducer.getShop);
  const plant = useSelector(shopReducer.getPlant);
  const location = useSelector(shopReducer.getLocation);
  const site = useSelector(shopReducer.getSite);

  const availableShops = "NA";

  useEffect(() => {
    if (!sites) {
      dispatch(shopActions.fetchAllSites());
    }
  }, [sites]);

  // useEffect(() => {
  //   let intervalId = "";
  //   if (!_.isEmpty(shop) && shop?.id) {
  //     if (!availableShops?.includes(String(shop.id))) {
  //       const params = {
  //         open: true,
  //         message: "ACCESS ERROR : You don't have View Access for this shop",
  //         type: "ERROR",
  //       };
  //       dispatch(setApplicationAlert(params));
  //       return;
  //     }
  //     dispatch(fetchAllMachines(shop?.id));
  //     // dispatch(fetchAllNotifications(shop?.id));
  //     // intervalId = setInterval(() => {
  //     //   dispatch(fetchAllNotifications(shop?.id));
  //     // }, 30000);
  //   }
  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [shop, availableShops]);

  useEffect(() => {
    if (!_.isEmpty(shop) && shop?.id) {
      dispatch(fetchAllMachines(shop?.id));
    }
  }, [shop]);

  useEffect(() => {
    if (sites !== undefined) {
      if (sites.length > 0) {
        if (!location && !shop && !plant && !site) {
          dispatch(shopActions.setShopDetails(site, location, plant, shop));
        } else {
          let shopObj = findPermittedShop(sites, availableShops);
          dispatch(
            shopActions.setShopDetails(
              shopObj?.site,
              shopObj?.location,
              shopObj?.plant,
              shopObj?.shop
            )
          );
        }
      }
    }
  }, [sites]);

  const handleSiteChange = (site) => {
    dispatch(
      shopActions.setShopDetails(
        site,
        site?.locations[0],
        site?.locations[0]?.plants[0],
        site?.locations[0]?.plants[0]?.shops[0]
      )
    );
    dispatch(shopActions.changeFilterChangeStatus(true));
  };

  const handleLocationChange = (location) => {
    dispatch(
      shopActions.setShopDetails(
        site,
        location,
        location?.plants[0],
        location?.plants[0]?.shops[0]
      )
    );
    dispatch(shopActions.changeFilterChangeStatus(true));
  };

  const handlePlantChange = (plant) => {
    dispatch(
      shopActions.setShopDetails(site, location, plant, plant?.shops[0])
    );
    dispatch(shopActions.changeFilterChangeStatus(true));
  };

  const handleShopChange = (shop) => {
    dispatch(shopActions.setShopDetails(site, location, plant, shop));
    dispatch(shopActions.changeFilterChangeStatus(true));
  };

  const handleChange = (event, newValue) => {
    if (newValue === "7") {
      if (getUser()?.role == "Admin") {
        //checking master
        const params = {
          open: true,
          message: "ACCESS ERROR :  You don't have Master Access",
          type: "ERROR",
        };
        dispatch(setApplicationAlert(params));
        return;
      }
    }
    setSelectedTab(newValue);
  };

  const shopNotAccessible = () => true;
  return (
    <Box className={classes["outer-container"]}>
      <CssBaseline />
      <Box className={classes["container-flex"]} sx={{ minWidth: "90vw" }}>
        <Typography sx={{ color: MarutiSilverDark }}>
          Last Updated at : {formatDateTime(new Date(), "DD/MM/YYYY h:mm A")}
        </Typography>
        <Box sx={{ display: "flex", gap: "1rem" }}>
          <Box sx={{ minWidth: "17rem" }}>
            <Select
              label="Site"
              value={site}
              onChange={(event) => handleSiteChange(event.target.value)}
            >
              {sites?.map((option) => (
                <MenuItem key={option.id} value={option}>
                  {option.site_name}
                </MenuItem>
              ))}
              <MenuItem style={{ display: "none" }} key={"none"} value={"none"}>
                none
              </MenuItem>
            </Select>
          </Box>
          <Box sx={{ minWidth: "20rem" }}>
            <Select
              label="Location"
              value={location}
              onChange={(event) => handleLocationChange(event.target.value)}
            >
              {site?.locations?.map((option) => (
                <MenuItem key={option.id} value={option}>
                  {option.location_name}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box sx={{ minWidth: "18rem" }}>
            <Select
              label="Plant"
              value={plant}
              onChange={(event) => handlePlantChange(event.target.value)}
            >
              {location?.plants?.map((option) => (
                <MenuItem key={option.id} value={option}>
                  {option.plant_name}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box sx={{ minWidth: "18rem" }}>
            <Select
              label="Shop"
              value={shop}
              onChange={(event) => handleShopChange(event.target.value)}
            >
              {plant?.shops?.map((option) => (
                <MenuItem key={option.id} value={option}>
                  {option.shop_name}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
      </Box>
      <Box
        className={classes["flex-column"]}
        sx={{
          pt: 2,
          overflow: "hidden",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {!shopNotAccessible() ? (
          <Box className={classes["shop-not-allowed"]}>
            <Skeleton
              animation="wave"
              variant="rectangular"
              sx={{ width: "100%", height: "100%" }}
            />
            <Skeleton
              animation="wave"
              variant="rectangular"
              sx={{ width: "100%", height: "100%" }}
            />
          </Box>
        ) : (
          <TabContext value={selectedTab}>
            <Box sx={{ mb: 0 }} className={classes["container-flex"]}>
              <Box
                className={classes["container-flex"]}
                sx={{ width: "fit-content", gap: "8rem" }}
              >
                <TabList onChange={handleChange} aria-label="dialog-tabs">
                  <Tab label="MATERIAL INSPECTION" value="9" />
                  {/* <Tab label="SAP LOGS" value="3" />
                  <Tab label="QUALITY" value="4" />
                  <Tab label="DOWNTIME" value="5" />
                  <Tab label="PLAN" value="6" />
                  <Tab label="REPORTS" value="7" />
                  <Tab label="MASTERS" value="8" /> */}
                </TabList>
              </Box>
              <Box className={classes["container-flex"]}>
                {/* {selectedTab !== "1" && selectedTab !== "3" && (
                  <DownloadHistory />
                )} */}
                <Alerts />
              </Box>
            </Box>
            <TabPanel
              value="1"
              sx={{
                minWidth: "90vw",
                display: selectedTab === "1" ? "flex" : "none",
                flexDirection: "column",
                overflow: "hidden",
                flex: 1,
              }}
            >
              <Shopview />
            </TabPanel>
            <TabPanel
              value="2"
              sx={{
                minWidth: "90vw",
                display: selectedTab === "2" ? "flex" : "none",
                flexDirection: "column",
                overflow: "hidden",
                flex: 1,
              }}
            >
              <Production />
            </TabPanel>
            <TabPanel
              value="3"
              sx={{
                minWidth: "90vw",
                display: selectedTab === "3" ? "flex" : "none",
                flexDirection: "column",
                overflow: "hidden",
                flex: 1,
              }}
            >
              <SapLogs />
            </TabPanel>
            <TabPanel
              value="4"
              sx={{
                minWidth: "90vw",
                display: selectedTab === "4" ? "flex" : "none",
                flexDirection: "column",
                overflow: "hidden",
                flex: 1,
              }}
            >
              <Quality />
            </TabPanel>
            <TabPanel
              value="5"
              sx={{
                minWidth: "90vw",
                display: selectedTab === "5" ? "flex" : "none",
                flexDirection: "column",
                overflow: "hidden",
                flex: 1,
              }}
            >
              <Downtime />
            </TabPanel>
            <TabPanel
              value="6"
              sx={{
                minWidth: "90vw",
                display: selectedTab === "6" ? "flex" : "none",
                flexDirection: "column",
                overflow: "hidden",
                flex: 1,
              }}
            >
              <Plan />
            </TabPanel>
            <TabPanel
              value="7"
              sx={{
                minWidth: "90vw",
                display: selectedTab === "7" ? "flex" : "none",
                flexDirection: "column",
                overflow: "hidden",
                flex: 1,
              }}
            >
              <Reports />
            </TabPanel>
            <TabPanel
              value="8"
              sx={{
                minWidth: "90vw",
                display: selectedTab === "8" ? "flex" : "none",
                flexDirection: "column",
                overflow: "hidden",
                flex: 1,
              }}
            >
              <Master />
            </TabPanel>
            <TabPanel
  value="9"
  sx={{
    minWidth: "90vw",
    display: selectedTab === "9" ? "flex" : "none",
    flexDirection: "column",
    overflow: "hidden",
    flex: 1,
  }}
>
  <MaterialInspection />
</TabPanel>
          </TabContext>
        )}
      </Box>
      <AlertContainer />
    </Box>
  );
};
export default Dashboard;
