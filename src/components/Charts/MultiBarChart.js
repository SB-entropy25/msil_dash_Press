import SquareIcon from "@mui/icons-material/Square";
import { Box, Paper, Skeleton, Typography } from "@mui/material";
import _ from "lodash";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Blue2, Grey5, MarutiBlack, TypePrimary } from "../../utils/colors";
import useStyles from "../Tooltips/Tooltip.styles";
import {
  getBarBottom,
  getBarBottomTick,
  getBarGraphHeight,
  getBarLeft,
  getBarWidth,
  getWidth,
} from "./helpers";

const MultiBarChart = ({
  color = "#000",
  data = [],
  fullwidth = false,
  loading = false,
  mapper = [],
  colors = [],
  shift = "All",
}) => {
  const classes = useStyles();
  const width = data?.length * 5 * getBarWidth();

  const CustomTooltip = ({ active, payload, label }) => {
    if (!payload) return null;
    const item = payload[0]?.payload;
    // console.log(item);
    if (active && !_.isEmpty(item)) {
      return (
        <Paper
          sx={{
            zIndex: 2000,
            p: 1.2,
            display: "flex",
            borderRadius: "0.4rem",
            "&>div": {
              "&:not(:last-child)": {
                paddingRight: "1.2rem",
                marginRight: "1.2rem",
                borderRight: `1px solid ${Grey5}`,
              },
            },
          }}
        >
          <Box
            sx={{
              width: "14rem",
              height: "fit-content",
            }}
          >
            <Typography
              variant="body1"
              sx={{ color: MarutiBlack, fontWeight: 600, mb: 1 }}
            >
              {item.name}
            </Typography>
            {["All", "A"].includes(shift) && (
              <Box className={classes["container-flex-start"]} sx={{ mt: 0.6 }}>
                <Box
                  className={classes["container-flex-start"]}
                  sx={{ gap: 0.6 }}
                >
                  <SquareIcon
                    fontSize="medium"
                    sx={{ color: item?.Avalue > 0 ? Blue2 : "#E5E5E5" }}
                  />
                  <Typography variant="body2" sx={{ color: MarutiBlack }}>
                    {item?.Aname}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: MarutiBlack }}>
                  {typeof item?.Avalue === "number"
                    ? item?.Avalue?.toFixed(2)
                    : "0"}
                </Typography>
              </Box>
            )}

            {["All", "B"].includes(shift) && (
              <Box className={classes["container-flex-start"]} sx={{ mt: 0.6 }}>
                <Box
                  className={classes["container-flex-start"]}
                  sx={{ gap: 0.6 }}
                >
                  <SquareIcon
                    fontSize="medium"
                    sx={{ color: item?.Bvalue > 0 ? Blue2 : "#E5E5E5" }}
                  />
                  <Typography variant="body2" sx={{ color: MarutiBlack }}>
                    {item?.Bname}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: MarutiBlack }}>
                  {typeof item?.Bvalue === "number"
                    ? item?.Bvalue?.toFixed(2)
                    : "0"}
                </Typography>
              </Box>
            )}
            {["All", "C"].includes(shift) && (
              <Box className={classes["container-flex-start"]} sx={{ mt: 0.6 }}>
                <Box
                  className={classes["container-flex-start"]}
                  sx={{ gap: 0.6 }}
                >
                  <SquareIcon
                    fontSize="medium"
                    sx={{ color: item?.Cvalue > 0 ? Blue2 : "#E5E5E5" }}
                  />
                  <Typography variant="body2" sx={{ color: MarutiBlack }}>
                    {item?.Cname}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: MarutiBlack }}>
                  {typeof item?.Cvalue === "number"
                    ? item?.Cvalue?.toFixed(2)
                    : "0"}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      );
    }
    return null;
  };
  return (
    <Box
      className="prodigi-bar-container"
      style={{ height: getBarGraphHeight() }}
    >
      {loading ? (
        <Skeleton
          sx={{ height: "100%", width: "100%" }}
          animation="wave"
          variant="rectangular"
        />
      ) : (
        <Box
          className="prodigi-inner-bar-container"
          style={{ minWidth: fullwidth ? "100%" : "88vw", width: width + "px" }}
        >
          <ResponsiveContainer height="100%">
            <BarChart
              height="100%"
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: getBarLeft(),
                bottom: getBarBottom(),
              }}
              barGap={25}
              barSize={getWidth(34)}
              className="prodigi-chart"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                tickMargin={getBarBottomTick()}
                tickLine={false}
                axisLine={false}
                dataKey="name"
              />
              <YAxis
                className="custom-y-axis"
                tickLine={false}
                tick={{ dy: -8 }}
                domain={[0, "dataMax"]}
              />
              <Tooltip
                wrapperStyle={{
                  zIndex: 10,
                }}
                cursor={false}
                content={<CustomTooltip />}
              />

              {/* Shift 1 */}
              {["All", "A"].includes(shift) && (
                <Bar stackId="A" dataKey="Avalue" fill={color}>
                  <LabelList
                    dataKey="Aname"
                    position="bottom"
                    style={{ stroke: TypePrimary, strokeWidth: 0 }}
                  />
                </Bar>
              )}
              {["All", "A"].includes(shift) && (
                <Bar stackId="A" dataKey="Agap" fill="#E5E5E5" />
              )}

              {/* Shift 2 */}
              {["All", "B"].includes(shift) && (
                <Bar stackId="B" dataKey="Bvalue" fill={color}>
                  <LabelList
                    dataKey="Bname"
                    position="bottom"
                    style={{ stroke: TypePrimary, strokeWidth: 0 }}
                  />
                </Bar>
              )}
              {["All", "B"].includes(shift) && (
                <Bar stackId="B" dataKey="Bgap" fill="#E5E5E5" />
              )}

              {/* Shift 3 */}
              {["All", "C"].includes(shift) && (
                <Bar stackId="C" dataKey="Cvalue" fill={color}>
                  <LabelList
                    dataKey="Cname"
                    position="bottom"
                    style={{ stroke: TypePrimary, strokeWidth: 0 }}
                  />
                </Bar>
              )}
              {["All", "C"].includes(shift) && (
                <Bar stackId="C" dataKey="Cgap" fill="#E5E5E5" />
              )}
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
};
export default MultiBarChart;
