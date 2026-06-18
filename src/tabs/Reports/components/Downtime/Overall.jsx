import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import BarIcon from "../../../../assets/icons/bar.png";
import MultiStackedBarChart from "../../../../components/Charts/MultiStackedBarChart";
import IconAlert from "../../../../components/IconAlert/IconAlert";
import BarLegend from "../../../../components/Legends/BarLegend";
import { Grey7, TypeSecondary } from "../../../../utils/colors";
import { formatDateTime } from "../../../../utils/helperFunctions.utils";
import useStyles from "../../Reports.styles";

const Overall = ({
  graphData = [],
  onBarClick = () => {},
  max = 0,
  loading = false,
  filters = {},
}) => {
  const classes = useStyles();
  const [startEndDate, setStartEndDate] = useState({ minD: "", maxD: "" });
  useEffect(() => {
    if (graphData.length) {
      if (
        formatDateTime(filters?.start_time, "DD.MM.YYYY") ==
        formatDateTime(filters?.end_time, "DD.MM.YYYY")
      ) {
        setStartEndDate({ minD: filters?.start_time });
        return;
      } else {
        setStartEndDate({ minD: filters?.start_time, maxD: filters?.end_time });
      }
    }
  }, [graphData]);

  return (
    <Box
      sx={{
        border: `1px solid ${Grey7}`,
        mt: "1.6rem",
        flex: 1,
        borderRadius: "0.4rem",
        padding: "1.4rem 1.2rem",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Typography variant="body1" style={{ color: TypeSecondary }}>
          {formatDateTime(startEndDate?.minD, "DD.MM.YYYY")}
        </Typography>
        {startEndDate?.maxD && "-"}
        {startEndDate?.maxD && (
          <Typography variant="body1" style={{ color: TypeSecondary }}>
            {formatDateTime(startEndDate?.maxD, "DD.MM.YYYY")}
          </Typography>
        )}
      </Box>
      <BarLegend
        bars={["Running", "Idle", "Schedule Stop", "Breakdown"]}
        colors={["#D85140", "#F28705", "#F1BE42", "#58A55C"].reverse()}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          flex: 1,
        }}
      >
        {graphData?.length > 0 || loading ? (
          <MultiStackedBarChart
            loading={loading}
            data={graphData}
            colors={["#D85140", "#F28705", "#F1BE42", "#58A55C"]}
            mapper={["Running", "Idle", "ScheduleStop", "Breakdown"].reverse()}
            max={max}
            onBarClick={onBarClick}
            shift={filters?.shift}
          />
        ) : (
          <IconAlert title="Chart data not found">
            <img
              alt=""
              src={BarIcon}
              style={{ height: "20rem", width: "20rem" }}
            />
          </IconAlert>
        )}
      </Box>
    </Box>
  );
};

export default Overall;
