import React, { memo, useEffect, useState } from "react";
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "../../../../components/Charts/Charts.css";
import Loader from "../../../../components/Loader/Loader";
import {
  convertTo12HourFormat,
  formatDateTime,
} from "../../../../utils/helperFunctions.utils";
import "./Graph.css";

function LinerChart({ graphData, loading = true }) {
  const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (graphData?.actual_line?.length && graphData?.target_line?.length) {
      const actualData = [...graphData?.actual_line];
      const targetData = [...graphData?.target_line];
      if (actualData.length >= targetData.length) {
        const targetObject = targetData.reduce((acc, obj) => {
          acc[obj.timestamp] = obj.quantity;
          return acc;
        }, {});
        const combinedArray = actualData.map((obj, index) => ({
          timestamp: new Date(obj.timestamp).getTime(),
          // achieved: actualData[index]?.quantity,
          achieved: obj.quantity,
          plan: targetObject[obj.timestamp] ? targetObject[obj.timestamp] : 0,
          // plan: obj.quantity,
        }));
        setData(combinedArray);
      } else {
        const targetObject = actualData.reduce((acc, obj) => {
          acc[obj.timestamp] = obj.quantity;
          return acc;
        }, {});
        const combinedArray = targetData.map((obj, index) => ({
          timestamp: new Date(obj.timestamp).getTime(),
          // achieved: actualData[index]?.quantity,
          achieved: targetObject[obj.timestamp]
            ? targetObject[obj.timestamp]
            : 0,
          plan: obj.quantity,
          // plan: obj.quantity,
        }));
        setData(combinedArray);
      }
      // setLoading(false);
    } else {
      setData([]);
    }
  }, [graphData]);

  const extractDistinctHours = (data) => {
    const distinctHours = new Set();
    data.forEach((entry) => {
      const date = new Date(entry.timestamp);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const hour = date.getHours();
      distinctHours.add(`${month}/${day}/${year}-${hour}`);
    });
    return Array.from(distinctHours);
  };

  const distinctHours = extractDistinctHours(data);
  const customLabelFormatter = (value) => {
    const timeformat = convertTo12HourFormat(value, true);
    return `${timeformat}`;
  };

  const getBarGraphHeight = () => {
    const screenHeight = window.screen.height;
    // const screenWidth = window.screen.width;
    // console.log("height",screenHeight)
    let height = 220;
    if (screenHeight <= 900 && screenHeight >= 730) {
      height = 400;
    }
    if (screenHeight > 900) {
      height = 500;
    }
    return height;
  };
  return (
    <div style={{ width: "100%", height: `${getBarGraphHeight()}px` }}>
      {data?.length > 0 && !loading ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            className="prodigi-chart"
            width={650}
            height={"100%"}
            data={data}
            margin={{
              top: 5,
              bottom: 18,
              right: 7,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              ticks={distinctHours.map((time) => {
                const [date, hour] = time.split("-");
                return new Date(date).setHours(hour, 0, 0, 0);
              })}
              tickFormatter={(timestamp) => {
                return formatDateTime(timestamp, "hha");
              }}
              axisLine={{ stroke: "#d8d8d8" }}
            >
              <Label
                fill="#66696B"
                className="custom-label"
                value="Hourly"
                offset={0}
                position="insideBottom"
              />
            </XAxis>
            <YAxis axisLine={{ stroke: "#d8d8d8" }} />
            <Tooltip labelFormatter={customLabelFormatter} />
            <Line
              dot={false}
              type="monotone"
              dataKey="plan"
              name="Plan"
              stroke="#29AAD3"
            />
            <Line
              dot={false}
              type="monotone"
              dataKey="achieved"
              name="Actual"
              stroke="#293095"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        loading && <Loader sx={{ pt: 1.2 }} />
      )}
    </div>
  );
}

export default memo(LinerChart);
