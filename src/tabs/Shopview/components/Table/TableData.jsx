import { Box, LinearProgress, TableCell, TableRow } from "@mui/material";
import { Green, Red, Yellow, Yellow2 } from "../../../../utils/colors";
import useStyles from "./Table.styles";

const TableData = ({ row = {}, columnWidth }) => {
  const classes = useStyles();
  const { target_percent, actual, target } = row;
  // let targetPercent = actual>=target?100:target_percent >0?target_percent:100;
  let targetPercent = actual >= target ? 100 : target_percent;
  targetPercent = targetPercent > 100 ? 100 : targetPercent;
  return (
    <TableRow>
      <TableCell align="left" sx={{ width: columnWidth.machine }}>
        {row?.machine_name}
      </TableCell>

      <TableCell align="center" sx={{ width: columnWidth.target }}>
        <Box style={{ position: "relative" }}>
          <LinearProgress
            sx={{
              "& .MuiLinearProgress-bar": {
                backgroundColor:
                  row.status === "RUNNING"
                    ? Green
                    : row?.status === "IDLE"
                    ? Yellow
                    : row?.status === "SCHEDULED"
                    ? Yellow2
                    : Red,
              },
              borderRadius: "0.4rem",
            }}
            variant="determinate"
            value={targetPercent}
          />
          {row.critical === 1 && (
            <Box
              className={classes["progress-barder-critical"]}
              style={{
                left: `${targetPercent}%`,
              }}
            />
          )}
        </Box>
      </TableCell>

      <TableCell align="left" sx={{ width: columnWidth.targetAchieved }}>
        {Math.trunc(row?.actual)}
      </TableCell>
      <TableCell align="left" sx={{ width: columnWidth.targetValue }}>
        {Math.trunc(row?.target)}
      </TableCell>
      <TableCell align="left" sx={{ width: columnWidth.targetAchieved }}>
        {targetPercent?.toFixed(2)}%
      </TableCell>
    </TableRow>
  );
};
export default TableData;
