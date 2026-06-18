import { Box, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import MultiStackedBarChart from "../../../../components/Charts/MultiStackedBarChart";
import BarLegend from "../../../../components/Legends/BarLegend";
import { Grey7 } from "../../../../utils/colors";
import BreakdownChart from "./BreakdownChart";

const donut = [
  { name: "Running", value: 400 },
  { name: "Idle", value: 300 },
  { name: "Breakdown", value: 300 },
];

const SingleMachine = ({
  graphData = [],
  shift = "",
  max = 0,
  reason = "",
  selectedShift = "All",
}) => {
  const [newReason, setReason] = useState("");
  const [newshift, setShift] = useState("");

  useEffect(() => {
    if (reason) {
      setReason(reason);
      setShift(shift);
    }
  }, [reason]);

  const onBarClick = (data) => {
    console.log(data);
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
          overflow: "hidden",
          height: "100%",
        }}
      >
        <BarLegend
          sx={{ height: "2.5rem" }}
          bars={["Running", "Idle", "schedule stop", "Breakdown"]}
          colors={["#D85140", "#F28705", "#F1BE42", "#58A55C"].reverse()}
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
            colors={["#D85140", "#8C362A", "#F1BE42", "#58A55C"]}
            mapper={["Running", "Idle", "ScheduleStop", "Breakdown"].reverse()}
            max={max}
            fullwidth={true}
            onBarClick={onBarClick}
            shift={selectedShift}
          />
        </Box>
      </Box>
      <Divider orientation="vertical" flexItem />
      <BreakdownChart
        shift={newshift}
        graphData={graphData}
        max={max}
        reason={newReason}
      />
    </Box>
  );
};

export default SingleMachine;
