import { Circle } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Paper, Tab, Typography } from "@mui/material";
import { useRef, useState } from "react";
import DownloadIcon from "../../assets/icons/DownloadReport.svg";
import GreenArrow from "../../assets/icons/GreenArrow.svg";
import RefreshIcon from "../../assets/icons/Refresh.svg";
import {
  MarutiBlue500,
  StatusAlertSevere,
  StatusGreen,
} from "../../utils/colors";
import Downtime from "./components/Downtime/Downtime";
import Plan from "./components/Plan/Plan";
import Production from "./components/Production/Production";
import Master from "./components/Master/Master";

const StatusRate = ({ prodRateInfo }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
      <Typography variant="body1" sx={{ color: StatusGreen }}>
        1st Pass Rate:
      </Typography>
      <Typography
        variant="h4"
        sx={{ color: StatusGreen, display: "flex", alignItems: "center" }}
      >
        {`${prodRateInfo?.first_pass_rate || 0}%`}
        <img src={GreenArrow} style={{ margin: "0 0.2rem" }} />
      </Typography>
    </Box>
    <Typography variant="body1" sx={{ color: StatusGreen }}>
      |
    </Typography>
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
      <Typography variant="body1" sx={{ color: StatusGreen }}>
        Success Rate:
      </Typography>
      <Typography
        variant="h4"
        sx={{ color: StatusGreen, display: "flex", alignItems: "center" }}
      >
        {`${prodRateInfo?.success_rate || 0}%`}
        <img src={GreenArrow} style={{ margin: "0 0.2rem" }} />
      </Typography>
    </Box>
  </Box>
);

const SapLogs = () => {
  const childRef = useRef(null);

  const [selectedTab, setSelectedTab] = useState("1");
  const [prodRateInfo, setProdRateInfo] = useState({});

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleRefresh = () => {
    if (childRef.current) {
      childRef.current.performAction("refresh");
    }
  };

  const handleDownload = () => {
    if (childRef.current) {
      childRef.current.performAction("download");
    }
  };

  const updateRateInfo = (res) => {
    setProdRateInfo(res);
  };

  return (
    <>
      <Paper
        className="prodigi-paper"
        sx={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          flex: 1,
        }}
      >
        <TabContext value={selectedTab}>
          <Box
            sx={{
              borderColor: "divider",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TabList
              onChange={handleChange}
              aria-label="dialog-tabs"
              sx={{
                "& button": {
                  borderRadius: 1,
                },
                "& .Mui-selected": {
                  borderBottomColor: "blue",
                  backgroundColor: "#F4F5F8",
                },
              }}
            >
              <Tab label="Production" value="1" />
              <Tab label="Downtime" value="2" />
              <Tab label="Plan" value="3" />
              <Tab label="Master" value="4" />
            </TabList>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              {selectedTab === "1" && (
                <StatusRate prodRateInfo={prodRateInfo} />
              )}
              <Box onClick={handleRefresh}>
                <img
                  src={RefreshIcon}
                  style={{
                    height: "3.2rem",
                    width: "3.2rem",
                    cursor: "pointer",
                  }}
                />
              </Box>
              {selectedTab !== "4" && (
                <Box onClick={handleDownload}>
                  <img
                    src={DownloadIcon}
                    style={{
                      height: "3.2rem",
                      width: "3.2rem",
                      cursor: "pointer",
                    }}
                  />
                </Box>
              )}
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
            <Production ref={childRef} updateRateInfo={updateRateInfo} />
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
            <Downtime ref={childRef} />
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
            <Plan ref={childRef} />
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
            <Master ref={childRef} />
          </TabPanel>
        </TabContext>
      </Paper>
      {selectedTab !== "1" && (
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <Typography variant="h4" sx={{ color: MarutiBlue500 }}>
            File upload status:
          </Typography>
          <Circle
            fontSize="small"
            htmlColor={StatusGreen}
            sx={{ marginLeft: 1, marginRight: 0.4 }}
          />
          <Typography variant="body1">: File upload successful</Typography>
          <Circle
            fontSize="small"
            htmlColor={StatusAlertSevere}
            sx={{ marginLeft: 1, marginRight: 0.4 }}
          />
          <Typography variant="body1">: File upload failed</Typography>
        </Box>
      )}
    </>
  );
};

export default SapLogs;
