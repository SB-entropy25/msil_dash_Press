import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { getHeight, getWidth } from "./helpers";

const COLORS = ["#FFE091", "#FFCA45", "#807049", "#CCA237"];
const CustomTooltip = (props) => {
  const { active = false, payload } = props;
  const { name = "", value = 0 } = payload[0] || {};
  if (active) {
    return (
      <Paper sx={{ padding: "1.2rem" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Typography sx={{ fontSize: "1.2rem" }}>{name}: </Typography>
          <Typography sx={{ fontSize: "1.2rem" }}>
            {typeof value === "number" ? value?.toFixed(2) : "0"}
          </Typography>
        </Box>
      </Paper>
    );
  }
  return null;
};
const DonutChart = ({ colors = COLORS, data = [] }) => {
  return (
    <ResponsiveContainer width={getWidth(300)} height={getHeight(300)}>
      <PieChart width={"100%"} height={"100%"}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={getHeight(85)}
          outerRadius={getHeight(144)}
          paddingAngle={1}
          dataKey="value"
          startAngle={135}
          endAngle={495}
        >
          {data?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={CustomTooltip} />
      </PieChart>
    </ResponsiveContainer>
  );
};
export default DonutChart;
