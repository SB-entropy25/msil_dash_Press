import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import BarIcon from "../../../../assets/icons/bar.png";
import CategoricalMultiBarChart from "../../../../components/Charts/CategoricalMultiBarChart";
import IconAlert from "../../../../components/IconAlert/IconAlert";
import BarLegend from "../../../../components/Legends/BarLegend";
import { Grey7, TypeSecondary } from "../../../../utils/colors";
import {
  findStatingAndEndDate,
  formatDateTime,
} from "../../../../utils/helperFunctions.utils";

const Overall = ({
  data = [],
  bars = [],
  onBarClick = () => {},
  loading = false,
  colors = ["#000000", "#000000", "#000000", "#000000", "#000000", "#000000"],
  groups = [],
}) => {
  const [startEndDate, setStartEndDate] = useState({ minD: "", maxD: "" });

  useEffect(() => {
    if (data.length) {
      const { minsDate, maxSDate } = findStatingAndEndDate(data);
      console.log(minsDate, maxSDate);
      if (minsDate == maxSDate) {
        setStartEndDate({ minD: minsDate });
      } else {
        setStartEndDate({ minD: minsDate, maxD: maxSDate });
      }
    }
  }, [data]);

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
      <BarLegend bars={groups} colors={colors} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          flex: 1,
        }}
      >
        {data?.length > 0 || loading ? (
          <CategoricalMultiBarChart
            data={data}
            bars={bars}
            onBarClick={onBarClick}
            loading={loading}
          />
        ) : (
          <IconAlert title="Chart data not found">
            <img
              alt=""
              src={BarIcon}
              style={{ height: "100%", maxHeight: "20rem", maxWidth: "20rem" }}
            />
          </IconAlert>
        )}
      </Box>
    </Box>
  );
};

export default Overall;
