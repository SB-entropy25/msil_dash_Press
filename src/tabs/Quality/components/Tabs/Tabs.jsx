import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab, Typography } from "@mui/material";
import {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProdigiContext } from "../../../../App";
import { setApplicationAlert } from "../../../../redux/Actions/AlertActions";
import { getShop } from "../../../../redux/Reducers/PressShopReducer";
import {
  selectTotalPendingRework,
  selectTotalRework,
} from "../../../../redux/Selectors/QualitySelector";
import { MarutiBlack } from "../../../../utils/colors";
import useStyles from "../../Quality.styles";
import PunchingTable from "../PunchingTable/PunchingTable";
import UpdationTable from "../UpdationTable/UpdationTable";
import { getDownloadShops } from "../../../../services/auth";

const Tabs = forwardRef(({ handleTab, filters }, ref) => {
  const classes = useStyles();
  const punchingRef = useRef();
  const reworkRef = useRef();
  const [selectedTab, setSelectedTab] = useState("1");
  const total = useSelector(selectTotalRework);
  const pending_total_qty = useSelector(selectTotalPendingRework);
  const shop = useSelector(getShop);
  const dispatch = useDispatch();
  const context = useContext(ProdigiContext);
  const downloadShops = getDownloadShops();

  const checkAccess = () => {
    if (downloadShops?.includes(String(shop?.id))) {
      return true;
    }
    return false;
  };

  const handleChange = (event, newValue) => {
    if (newValue === "2") {
      if (!checkAccess()) {
        //checking master
        const params = {
          open: true,
          message: "ACCESS ERROR :  You don't have access to rework updation",
          type: "ERROR",
        };
        dispatch(setApplicationAlert(params));
        return;
      }
    }
    setSelectedTab(newValue);
    handleTab(newValue);
  };

  useImperativeHandle(ref, () => ({
    onRefresh,
  }));

  const onRefresh = () => {
    if (selectedTab === "1") {
      punchingRef.current.onRefresh();
    } else {
      reworkRef.current.onRefresh();
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        mt: "2.4rem",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        flex: 1,
      }}
    >
      <TabContext value={selectedTab}>
        <Box sx={{ mb: 0 }} className={classes["container-flex"]}>
          <TabList onChange={handleChange} aria-label="dialog-tabs">
            <Tab label="Quality Punching" value="1" className="prodigi-tab" />
            <Tab label="Rework Updation" value="2" className="prodigi-tab" />
          </TabList>
          <Box className={classes["quality-right-info"]}>
            {selectedTab === "2" && (
              <>
                <Box className={classes["prodigi-red-info"]}>
                  <Typography sx={{ color: MarutiBlack }}>
                    Total Rework Quantity: <strong>{total}</strong>
                  </Typography>
                </Box>
                <Box className={classes["prodigi-red-info"]}>
                  <Typography sx={{ color: MarutiBlack }}>
                    Pending Rework Quantity:{" "}
                    <strong>{pending_total_qty}</strong>
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Box>
        <TabPanel
          value="1"
          sx={{
            display: selectedTab === "1" ? "flex" : "none",
            flexDirection: "column",
            overflow: "hidden",
            flex: 1,
          }}
        >
          <PunchingTable ref={punchingRef} filters={filters} />
        </TabPanel>
        <TabPanel
          value="2"
          sx={{
            display: selectedTab === "2" ? "flex" : "none",
            flexDirection: "column",
            overflow: "hidden",
            flex: 1,
          }}
        >
          <UpdationTable ref={reworkRef} filters={filters} />
        </TabPanel>
      </TabContext>
    </Box>
  );
});
export default Tabs;
