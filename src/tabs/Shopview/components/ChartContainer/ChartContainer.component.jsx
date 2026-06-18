import CloseIcon from "@mui/icons-material/Close";
import { LinearProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import {
  Blue2,
  Green,
  MarutiBlack,
  Red,
  TypeSecondary,
  Yellow,
  Yellow2,
  skyBlue,
} from "../../../../utils/colors";
import LinerChart from "../LinerChart/LinerChart";
import useStyles from "./ChartContainer.styles";

const ChartContainer = ({
  graphData = [],
  isChartData = {},
  onClose = () => {},
  loading = true,
}) => {
  const classes = useStyles();
  const { target_percent, actual, target } = isChartData;
  // let targetPercent = actual>=target?100:target_percent >0?target_percent:100;
  let targetPercent = actual >= target ? 100 : target_percent;
  targetPercent = targetPercent > 100 ? 100 : targetPercent;
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Box
          className={classes["box-item-head"]}
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Typography variant="body4" sx={{ color: TypeSecondary }}>
            {isChartData?.machine_name}
          </Typography>
          <Typography variant="body3">
            <CloseIcon
              sx={{ color: TypeSecondary, cursor: "pointer" }}
              onClick={onClose}
            />
          </Typography>
        </Box>
        <Box
          className={classes["box-item-head"]}
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Box>
            <Typography
              variant="body3"
              sx={{ color: TypeSecondary, fontWeight: 400 }}
            >
              SPH
            </Typography>
            <Typography
              variant="body3"
              sx={{ color: TypeSecondary, paddingLeft: "0.5rem" }}
            >
              {isChartData?.sph?.toFixed(2) > 0
                ? isChartData?.sph?.toFixed(2)
                : 0}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="body3"
              sx={{ color: TypeSecondary, fontWeight: 400 }}
            >
              Efficiency
            </Typography>
            <Typography
              variant="body3"
              sx={{ color: TypeSecondary, paddingLeft: "0.5rem" }}
            >
              {isChartData?.efficiency?.toFixed(2)}%
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="body3"
              sx={{ color: TypeSecondary, fontWeight: 400 }}
            >
              Scheduled Stop
            </Typography>
            <Typography
              variant="body3"
              sx={{ color: TypeSecondary, paddingLeft: "0.5rem" }}
            >
              {isChartData?.planned_stop?.toFixed()} min
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="body3"
              sx={{ color: TypeSecondary, fontWeight: 400 }}
            >
              Downtime
            </Typography>
            <Typography
              variant="body3"
              sx={{ color: TypeSecondary, paddingLeft: "0.5rem" }}
            >
              {isChartData?.downtime?.toFixed()} min
            </Typography>
          </Box>
        </Box>
        <Box className={classes["box-item-head"]}>
          <Box className={classes["box-item-flex"]}>
            <Box sx={{ textAlign: "left" }}>
              <Typography variant="body3" sx={{ color: MarutiBlack }}>
                {Math.trunc(isChartData?.actual)}
              </Typography>
              <Typography variant="body2" sx={{ color: MarutiBlack }}>
                Actual
              </Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="body3" sx={{ color: MarutiBlack }}>
                {Math.trunc(isChartData?.target)}
              </Typography>
              <Typography variant="body2" sx={{ color: MarutiBlack }}>
                Target
              </Typography>
            </Box>
          </Box>
          <Box sx={{ marginTop: "0.4rem" }}>
            <LinearProgress
              sx={{
                "& .MuiLinearProgress-bar": {
                  backgroundColor:
                    isChartData.status === "RUNNING"
                      ? Green
                      : isChartData?.status === "IDLE"
                      ? Yellow
                      : isChartData?.status === "SCHEDULED"
                      ? Yellow2
                      : Red,
                },
                height: "0.6rem",
                borderRadius: "0.4rem",
              }}
              variant="determinate"
              value={targetPercent}
            />
          </Box>
        </Box>
        <Box></Box>
        <Box
          className={classes["box-item-flex"]}
          sx={{ margin: "1rem 1.5rem 0 1rem" }}
        >
          <Box className={classes["chart-qnty"]}>
            <Typography variant="body1">Quantity</Typography>
          </Box>

          <Box className={classes["box-item-flex"]}>
            <Box
              className={classes["actual-plan"]}
              sx={{ backgroundColor: skyBlue }}
            />
            <Typography variant="body1">Plan</Typography>
            <Box
              className={classes["actual-plan"]}
              sx={{
                marginLeft: "0.5rem",
                backgroundColor: Blue2,
              }}
            />
            <Typography variant="body1">Actual</Typography>
          </Box>
        </Box>
      </Box>
      <LinerChart graphData={graphData} loading={loading} />
    </Box>
  );
};

export default ChartContainer;
