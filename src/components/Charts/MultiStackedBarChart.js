import { Box, Paper, Skeleton } from "@mui/material";
import _ from "lodash";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Grey5, TypePrimary } from "../../utils/colors";
import DonutLegend from "../Legends/DonutLegend";
import "./Charts.css";
import {
  exists,
  getBarBottom,
  getBarBottomTick,
  getBarGraphHeight,
  getBarLeft,
  getBarWidth,
  getWidth,
} from "./helpers";

const MultiStackedBarChart = ({
  colors = [],
  mapper = [],
  data = [],
  max = 0,
  fullwidth = false,
  onBarClick = () => {},
  loading = false,
  shift = "All",
}) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (!payload) return null;
    const item = payload[0]?.payload;
    // shift A
    const shiftA = [];
    if (exists(item?.Avalue1)) {
      shiftA.push({ name: mapper[0], value: item.Avalue1 });
    }
    if (exists(item?.Avalue2)) {
      shiftA.push({ name: mapper[1], value: item.Avalue2 });
    }
    if (exists(item?.Avalue3)) {
      shiftA.push({ name: mapper[2], value: item.Avalue3 });
    }
    if (exists(item?.Avalue4)) {
      shiftA.push({ name: mapper[3], value: item.Avalue4 });
    }
    if (exists(item?.Avalue5)) {
      shiftA.push({ name: mapper[4], value: item.Avalue5 });
    }
    // shift B
    const shiftB = [];
    if (exists(item?.Bvalue1)) {
      shiftB.push({ name: mapper[0], value: item.Bvalue1 });
    }
    if (exists(item?.Bvalue2)) {
      shiftB.push({ name: mapper[1], value: item.Bvalue2 });
    }
    if (exists(item?.Bvalue3)) {
      shiftB.push({ name: mapper[2], value: item.Bvalue3 });
    }
    if (exists(item?.Bvalue4)) {
      shiftB.push({ name: mapper[3], value: item.Bvalue4 });
    }
    if (exists(item?.Bvalue5)) {
      shiftB.push({ name: mapper[4], value: item.Bvalue5 });
    }
    // shift C
    const shiftC = [];
    if (exists(item?.Cvalue1)) {
      shiftC.push({ name: mapper[0], value: item.Cvalue1 });
    }
    if (exists(item?.Cvalue2)) {
      shiftC.push({ name: mapper[1], value: item.Cvalue2 });
    }
    if (exists(item?.Cvalue3)) {
      shiftC.push({ name: mapper[2], value: item.Cvalue3 });
    }
    if (exists(item?.Cvalue4)) {
      shiftC.push({ name: mapper[3], value: item.Cvalue4 });
    }
    if (exists(item?.Cvalue5)) {
      shiftC.push({ name: mapper[4], value: item.Cvalue5 });
    }
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
          {["All", "A"].includes(shift) && shiftA.length !== 0 && (
            <DonutLegend
              data={shiftA?.reverse()}
              shift="A"
              colors={[...colors].reverse()}
            />
          )}
          {["All", "B"].includes(shift) && shiftB.length !== 0 && (
            <DonutLegend
              data={shiftB?.reverse()}
              shift="B"
              colors={[...colors].reverse()}
            />
          )}
          {["All", "C"].includes(shift) && shiftC.length !== 0 && (
            <DonutLegend
              data={shiftC?.reverse()}
              shift="C"
              colors={[...colors].reverse()}
            />
          )}
        </Paper>
      );
    }
    return null;
  };

  const handleBarClick = (entry, payload) => {
    const object = { ...payload, item: entry };
    onBarClick(object);
  };
  const width = data?.length * 5 * getBarWidth();
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
          style={{ minWidth: fullwidth ? "98%" : "88vw", width: width + "px" }}
        >
          <ResponsiveContainer height="100%">
            <BarChart
              height="100%"
              data={data}
              margin={{
                top: 20,
                right: fullwidth ? 5 : 30,
                left: getBarLeft(),
                bottom: getBarBottom(),
              }}
              barGap={25}
              barSize={getWidth(34)}
              className="prodigi-chart"
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
                <Bar
                  stackId="A"
                  dataKey="Avalue1"
                  fill={colors[0]}
                  //
                >
                  {data?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleBarClick(entry, {
                          shift: "A",
                          reasons: "reasonsA",
                          name: "Avalue1",
                        })
                      }
                    />
                  ))}
                  <LabelList
                    dataKey="Aname"
                    position="bottom"
                    style={{ stroke: TypePrimary, strokeWidth: 0 }}
                  />
                </Bar>
              )}
              {["All", "A"].includes(shift) && (
                <Bar stackId="A" dataKey="Avalue2" fill={colors[1]}>
                  {data?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleBarClick(entry, {
                          shift: "A",
                          reasons: "reasonsA",
                          name: "Avalue2",
                        })
                      }
                    />
                  ))}
                </Bar>
              )}
              {["All", "A"].includes(shift) && (
                <Bar stackId="A" dataKey="Avalue3" fill={colors[2]}>
                  {data?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleBarClick(entry, {
                          shift: "A",
                          reasons: "reasonsA",
                          name: "Avalue3",
                        })
                      }
                    />
                  ))}
                </Bar>
              )}
              {["All", "A"].includes(shift) && (
                <Bar stackId="A" dataKey="Avalue4" fill={colors[3]}>
                  {data?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleBarClick(entry, {
                          shift: "A",
                          reasons: "reasonsA",
                          name: "Avalue4",
                        })
                      }
                    />
                  ))}
                </Bar>
              )}
              {["All", "A"].includes(shift) && (
                <Bar stackId="A" dataKey="Avalue5" fill={colors[4]}>
                  {data?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleBarClick(entry, {
                          shift: "A",
                          reasons: "reasonsA",
                          name: "Avalue5",
                        })
                      }
                    />
                  ))}
                </Bar>
              )}
              {["All", "A"].includes(shift) && (
                <Bar stackId="A" dataKey="Agap" fill="#E5E5E5" />
              )}

              {/* Shift 2 */}
              {["All", "B"].includes(shift) && (
                <Bar stackId="B" dataKey="Bvalue1" fill={colors[0]}>
                  <LabelList
                    dataKey="Bname"
                    position="bottom"
                    style={{ stroke: TypePrimary, strokeWidth: 0 }}
                  />
                  {data?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleBarClick(entry, {
                          shift: "B",
                          reasons: "reasonsB",
                          name: "Bvalue1",
                        })
                      }
                    />
                  ))}
                </Bar>
              )}
              {["All", "B"].includes(shift) && (
                <Bar stackId="B" dataKey="Bvalue2" fill={colors[1]}>
                  {data?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleBarClick(entry, {
                          shift: "B",
                          reasons: "reasonsB",
                          name: "Bvalue2",
                        })
                      }
                    />
                  ))}
                </Bar>
              )}
              {["All", "B"].includes(shift) && (
                <Bar stackId="B" dataKey="Bvalue3" fill={colors[2]}>
                  {data?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleBarClick(entry, {
                          shift: "B",
                          reasons: "reasonsB",
                          name: "Bvalue3",
                        })
                      }
                    />
                  ))}
                </Bar>
              )}
              {["All", "B"].includes(shift) && (
                <Bar stackId="B" dataKey="Bvalue4" fill={colors[3]}>
                  {data?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleBarClick(entry, {
                          shift: "B",
                          reasons: "reasonsB",
                          name: "Bvalue4",
                        })
                      }
                    />
                  ))}
                </Bar>
              )}
              {["All", "B"].includes(shift) && (
                <Bar stackId="B" dataKey="Bvalue5" fill={colors[4]}>
                  {data?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleBarClick(entry, {
                          shift: "B",
                          reasons: "reasonsB",
                          name: "Bvalue5",
                        })
                      }
                    />
                  ))}
                </Bar>
              )}
              {["All", "B"].includes(shift) && (
                <Bar stackId="B" dataKey="Bgap" fill="#E5E5E5" />
              )}

              {/* Shift 3 */}
              {["All", "C"].includes(shift) && (
                <Bar stackId="C" dataKey="Cvalue1" fill={colors[0]}>
                  {data?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleBarClick(entry, {
                          shift: "C",
                          reasons: "reasonsC",
                          name: "Cvalue1",
                        })
                      }
                    />
                  ))}

                  <LabelList
                    dataKey="Cname"
                    position="bottom"
                    style={{ stroke: TypePrimary, strokeWidth: 0 }}
                  />
                </Bar>
              )}
              {["All", "C"].includes(shift) && (
                <Bar stackId="C" dataKey="Cvalue2" fill={colors[1]}>
                  {data?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleBarClick(entry, {
                          shift: "C",
                          reasons: "reasonsC",
                          name: "Cvalue2",
                        })
                      }
                    />
                  ))}
                </Bar>
              )}
              {["All", "C"].includes(shift) && (
                <Bar stackId="C" dataKey="Cvalue3" fill={colors[2]}>
                  {data?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleBarClick(entry, {
                          shift: "C",
                          reasons: "reasonsC",
                          name: "Cvalue3",
                        })
                      }
                    />
                  ))}
                </Bar>
              )}
              {["All", "C"].includes(shift) && (
                <Bar stackId="C" dataKey="Cvalue4" fill={colors[3]}>
                  {data?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleBarClick(entry, {
                          shift: "C",
                          reasons: "reasonsC",
                          name: "Cvalue4",
                        })
                      }
                    />
                  ))}
                </Bar>
              )}
              {["All", "C"].includes(shift) && (
                <Bar stackId="C" dataKey="Cvalue5" fill={colors[4]}>
                  {data?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleBarClick(entry, {
                          shift: "C",
                          reasons: "reasonsC",
                          name: "Cvalue5",
                        })
                      }
                    />
                  ))}
                </Bar>
              )}
              {["All", "C"].includes(shift) && (
                <Bar stackId="C" dataKey="Cgap" fill="#E5E5E5" />
              )}

              <ReferenceLine
                y={max}
                label={{
                  // value: "Value in #",
                  value: "",

                  position: "insideBottomLeft",
                }}
                strokeDasharray="3 3"
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
};
export default MultiStackedBarChart;
