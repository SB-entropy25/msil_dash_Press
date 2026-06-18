import { TabContext, TabList } from "@mui/lab";
import { Box, Tab, Typography } from "@mui/material";
import { useState } from "react";
import PieIcon from "../../../../assets/icons/pie.png";
import DonutChart from "../../../../components/Charts/DonutChart";
import IconAlert from "../../../../components/IconAlert/IconAlert";
import DonutLegend from "../../../../components/Legends/DonutLegend";
import { TypeSecondary } from "../../../../utils/colors";
import useStyles from "../../Reports.styles";
import { checkDataValid, downtimeDonutMapper, getColors } from "../mappers";

const shadesOfRed = [
  "#fdf6f5",
  "#f9e3e1",
  "#f5d1cd",
  "#f1bfb8",
  "#ecaca4",
  "#e89a90",
  "#e4887c",
  "#e07568",
  "#dc6354",
  "#d8503f",
  "#d43e2b",
  "#c03827",
  "#ab3223",
  "#972c1f",
  "#83261b",
  "#6f2117",
  "#5b1b13",
  "#47150e",
  "#320f0a",
  "#1e0906",
];

const shadesOfYellow = [
  "#fefbf4",
  "#fcf3dd",
  "#fbecc6",
  "#f9e4b0",
  "#f7dc99",
  "#f6d483",
  "#f4cc6c",
  "#f2c555",
  "#f1bd3f",
  "#efb528",
  "#edad12",
  "#d79d10",
  "#c08c0e",
  "#aa7c0d",
  "#936b0b",
  "#7c5b09",
  "#664a08",
  "#4f3a06",
  "#392904",
  "#221903",
];

const BreakdownChart = ({ graphData = [], shift = "", reason = "" }) => {
  const classes = useStyles();
  const [checked, setChecked] = useState("");
  const [selectedTab, setSelectedTab] = useState("1");
  // const handleChange = (event) => {
  //   setChecked(event.target.checked);
  // };
  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box
      sx={{
        flex: 1,
        padding: "1.4rem 1.2rem",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "100%",
        // border:"1px solid red"
      }}
    >
      <Box className={classes["container-flex"]} sx={{ height: "2.5rem" }}>
        <Typography variant="h4" sx={{ color: TypeSecondary }}>
          {selectedTab === "2"
            ? "Downtime Idle Breakdown"
            : selectedTab === "1"
            ? "Downtime Breakdown"
            : "Downtime Schedule Stop"}
        </Typography>

        {/* <CustomSwitch
          leftLabel="Breakdown"
          rightLabel="Idle"
          checked={checked}
          handleChange={handleChange}
        /> */}
        <TabContext value={selectedTab}>
          <TabList
            onChange={handleChange}
            aria-label="dialog-tabs"
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "transparent",
              },
            }}
          >
            <Tab label="Breakdown" value="1" className="break-down-tab" />
            <Tab label="Idle" value="2" className="break-down-tab" />
            <Tab label="Schedule Stop" value="3" className="break-down-tab" />
          </TabList>
        </TabContext>
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          position: "relative",
          // justifyContent: "space-around",
          // alignItems: "center",
          flexDirection: "column",
          overflow: "hidden",
          // border:"1px solid red"
        }}
      >
        {selectedTab === "2" ? (
          graphData[0][reason]?.idle_reasons?.length > 0 &&
          !checkDataValid(graphData[0][reason]?.idle_reasons) ? (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                position: "relative",
                justifyContent: "space-around",
                alignItems: "center",
                overflow: "hidden",
                // height:"100%",
                // border: "1px solid green",
              }}
            >
              <DonutChart
                data={
                  downtimeDonutMapper(graphData[0][reason]?.idle_reasons) || []
                }
                // colors={shadesOfYellow}
                colors={getColors(
                  shadesOfYellow,
                  graphData[0][reason]?.idle_reasons?.length || 1
                )}
              />
              <DonutLegend
                shift={shift}
                isCnt={true}
                data={
                  downtimeDonutMapper(graphData[0][reason]?.idle_reasons) || []
                }
                colors={getColors(
                  shadesOfYellow,
                  graphData[0][reason]?.idle_reasons?.length || 1
                )}
              />
            </Box>
          ) : (
            <IconAlert title="Chart data not found">
              <img
                alt=""
                src={PieIcon}
                style={{ height: "20rem", width: "20rem" }}
              />
            </IconAlert>
          )
        ) : selectedTab === "1" ? (
          graphData[0][reason]?.breakdown_reasons?.length > 0 &&
          !checkDataValid(graphData[0][reason]?.breakdown_reasons) ? (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                position: "relative",
                justifyContent: "space-around",
                alignItems: "center",
                overflow: "hidden",
                // height:"100%",
                // border: "1px solid green",
              }}
            >
              <DonutChart
                data={
                  downtimeDonutMapper(
                    graphData[0][reason]?.breakdown_reasons
                  ) || []
                }
                colors={getColors(
                  shadesOfRed,
                  graphData[0][reason]?.breakdown_reasons?.length || 0
                )}
              />
              <DonutLegend
                shift={shift}
                isCnt={true}
                data={
                  downtimeDonutMapper(
                    graphData[0][reason]?.breakdown_reasons
                  ) || []
                }
                colors={getColors(
                  shadesOfRed,
                  graphData[0][reason]?.breakdown_reasons?.length || 0
                )}
              />
            </Box>
          ) : (
            <IconAlert title="Chart data not found">
              <img
                alt=""
                src={PieIcon}
                style={{ height: "20rem", width: "20rem" }}
              />
            </IconAlert>
          )
        ) : graphData[0][reason]?.scheduled_reasons?.length > 0 &&
          !checkDataValid(graphData[0][reason]?.scheduled_reasons) ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              position: "relative",
              justifyContent: "space-around",
              alignItems: "center",
              overflow: "hidden",
              // height:"100%",
              // border:"1px solid green"
            }}
          >
            <DonutChart
              data={
                downtimeDonutMapper(graphData[0][reason]?.scheduled_reasons) ||
                []
              }
              colors={getColors(
                shadesOfRed,
                graphData[0][reason]?.scheduled_reasons?.length || 0
              )}
            />
            <DonutLegend
              shift={shift}
              isCnt={true}
              data={
                downtimeDonutMapper(graphData[0][reason]?.scheduled_reasons) ||
                []
              }
              colors={getColors(
                shadesOfRed,
                graphData[0][reason]?.scheduled_reasons?.length || 0
              )}
            />
          </Box>
        ) : (
          <IconAlert title="Chart data not found">
            <img
              alt=""
              src={PieIcon}
              style={{ height: "20rem", width: "20rem" }}
            />
          </IconAlert>
        )}
      </Box>
    </Box>
  );
};

export default BreakdownChart;
