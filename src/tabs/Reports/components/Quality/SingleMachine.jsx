import { Box, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import PieIcon from "../../../../assets/icons/pie.png";
import DonutChart from "../../../../components/Charts/DonutChart";
import MultiStackedBarChart from "../../../../components/Charts/MultiStackedBarChart";
import IconAlert from "../../../../components/IconAlert/IconAlert";
import BarLegend from "../../../../components/Legends/BarLegend";
import DonutLegend from "../../../../components/Legends/DonutLegend";
import { Grey7, TypeSecondary } from "../../../../utils/colors";
import useStyles from "../../Reports.styles";
import { checkDataValid, getColors, qualityDonutMapper } from "../mappers";

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

const SingleMachine = ({
  graphData = [],
  shift = "",
  max = 0,
  reason = "",
  selectedShift = "All",
}) => {
  const classes = useStyles();
  const [newReason, setReason] = useState("");
  const [newshift, setShift] = useState("");

  useEffect(() => {
    if (reason) {
      setReason(reason);
      setShift(shift);
    }
  }, [reason]);

  const onBarClick = (data) => {
    setReason(data?.reasons);
    setShift(data?.shift);
  };

  return (
    <Box
      sx={{
        border: `1px solid ${Grey7}`,
        mt: "1.6rem",
        flex: 1,
        borderRadius: "0.4rem",
        display: "flex",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flex: 1,
          padding: "1.4rem 1.2rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <BarLegend
          sx={{ height: "2.5rem" }}
          bars={["OK", "Hold", "Recycle", "Pending Rework", "Reject"]}
          colors={[
            "#FF0000",
            "#C20CE8",
            "#1D00FF",
            "#FFCE19",
            "#00B333",
          ].reverse()}
        />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            overflow: "hidden",
          }}
        >
          <MultiStackedBarChart
            data={graphData}
            colors={["#FF0000", "#C20CE8", "#1D00FF", "#FFCE19", "#00B333"]}
            mapper={[
              "OK",
              "Hold",
              "Recycle",
              "Pending Rework",
              "Reject",
            ].reverse()}
            max={max}
            fullwidth={true}
            onBarClick={onBarClick}
            shift={selectedShift}
          />
        </Box>
      </Box>
      <Divider orientation="vertical" flexItem />
      <Box
        sx={{
          flex: 1,
          padding: "1.4rem 1.2rem",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          height: "100%",
        }}
      >
        <Box className={classes["container-flex"]} sx={{ height: "2.5rem" }}>
          <Typography variant="h4" sx={{ color: TypeSecondary }}>
            {"Reject Breakdown"}
          </Typography>
        </Box>
        {graphData[0][newReason]?.length > 0 &&
        !checkDataValid(graphData[0][newReason]) ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              position: "relative",
              justifyContent: "space-around",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <DonutChart
              data={qualityDonutMapper(graphData[0][newReason]) || []}
              colors={getColors(
                shadesOfRed,
                graphData[0][newReason]?.length || 0
              )}
            />
            <DonutLegend
              shift={newshift}
              data={qualityDonutMapper(graphData[0][newReason]) || []}
              isQty={true}
              isCnt={true}
              colors={getColors(
                shadesOfRed,
                graphData[0][newReason]?.length || 0
              )}
            />
          </Box>
        ) : (
          <IconAlert title="Chart data not found">
            <img
              alt=""
              src={PieIcon}
              style={{ height: "100%", maxHeight: "20rem", maxWidth: "20rem" }}
            />
          </IconAlert>
        )}
      </Box>
    </Box>
  );
};

export default SingleMachine;
