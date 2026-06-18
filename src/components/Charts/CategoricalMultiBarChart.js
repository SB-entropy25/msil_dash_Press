import { Box, Paper, Skeleton } from "@mui/material";
import _ from "lodash";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Grey5, TypePrimary } from "../../utils/colors";
import BarTooltip from "../Tooltips/BarTooltip";
import "./Charts.css";
import {
  exists,
  getBarGraphHeight,
  getBarLeft,
  getBarWidth,
  getWidth,
} from "./helpers";

const CategoricalMultiBarChart = ({
  bars = [],
  data = [],
  onBarClick = () => {},
  fullwidth = false,
  loading = false,
}) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (!payload) return null;
    const item = payload[0]?.payload;
    const list = [];
    bars?.forEach((bar, i) => {
      if (exists(item) && exists(item[bar?.name])) {
        list.push({
          name: bar?.name,
          value: item[bar?.name],
          color: bar?.color,
        });
      }
    });
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
          <BarTooltip title={item?.name} data={list} />
        </Paper>
      );
    }
    return null;
  };

  const handleBarClick = (payload) => {
    onBarClick(payload);
  };

  const width = data?.length * 6.5 * getBarWidth();
  return (
    <Box
      className="prodigi-bar-container"
      style={{ height: getBarGraphHeight() }}
    >
      {loading ? (
        <Skeleton
          sx={{ width: "100%", flex: 1 }}
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
                top: 0,
                right: 30,
                left: getBarLeft(),
                bottom: 80,
              }}
              barGap={5}
              barSize={getWidth(34)}
              className="prodigi-chart"
            >
              <Tooltip
                wrapperStyle={{
                  zIndex: 10,
                }}
                cursor={false}
                content={<CustomTooltip />}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                // tickMargin={getBarBottomTick()}
                tickLine={false}
                axisLine={false}
                dataKey="name"
                orientation="top"
              />
              <YAxis
                className="custom-y-axis"
                tickLine={false}
                tick={{ dy: -8 }}
                domain={[0, "dataMax"]}
                // tickCount={5}
              />
              {bars?.map((bar, index) => (
                <Bar stackId={bar?.name} dataKey={bar?.name} fill={bar?.color}>
                  {data?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleBarClick({ ...entry, bar: bar?.name })
                      }
                    />
                  ))}
                  <LabelList
                    offset={30}
                    angle="-60"
                    dataKey={bar?.name + " label"}
                    position="bottom"
                    style={{ stroke: TypePrimary, strokeWidth: 0 }}
                  />
                </Bar>
              ))}
              {bars?.map((bar, index) => (
                <Bar
                  stackId={bar?.name}
                  dataKey={bar?.name + " total"}
                  fill="#E5E5E5"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
};
export default CategoricalMultiBarChart;
