import {
  Box,
  styled,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { Fragment } from "react";
import { downtimeColumn } from "./DowntimeColumn";
import {
  MarutiWhite,
  StatusAlertSevere,
  StatusGreen,
  Yellow,
} from "../../../../../../utils/colors";
import { Circle } from "@mui/icons-material";
import moment from "moment";

const colorMap = {
  FAILURE: StatusAlertSevere,
  SUCCESS: StatusGreen,
  PENDING: Yellow,
};
const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: "#fff",
    color: "#000",
    width: "30rem",
    fontSize: "1.4rem",
    padding: "0.4rem 1rem 0.4rem 1rem",
    boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
  },
}));

const dateTimeFormat = (value) => {
  if (value) {
    return moment(value).format("DD-MM-YYYY | hh:mm:ss");
  }
  return "-";
};

const TableData = ({ tableData }) => {
  const TableCellData = ({ column = {}, item = "" }) => {
    switch (column?.value) {
      case "data_sent_time":
        return (
          <CustomTooltip title={tableData?.filename || ""} disableInteractive>
            <Box
              sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            >
              <Circle
                fontSize="small"
                htmlColor={colorMap[tableData.data_sent_flag] || "gray"}
                sx={{ marginRight: 1 }}
              />
              <Typography>{dateTimeFormat(item)}</Typography>
            </Box>
          </CustomTooltip>
        );
      case "remarks":
        return (
          <CustomTooltip title={tableData?.remarks || ""} disableInteractive>
            <Typography
              noWrap
              sx={{
                overflow: "hidden",
                cursor: "pointer",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "100%",
              }}
            >
              {item}
            </Typography>
          </CustomTooltip>
        );
      case "start_time":
      case "end_time":
        return <Typography>{dateTimeFormat(item)}</Typography>;
      case "header_material":
      case "program_no":
      case "work_center":
      case "duration":
      case "reason":
      case "shift":
        return <Typography noWrap>{item || "-"}</Typography>;
      default:
        return item;
    }
  };

  const sortedColumns = Object.values(downtimeColumn).sort(
    (a, b) => a.index - b.index
  );

  return (
    <Fragment>
      <TableRow>
        {sortedColumns.map((column, index) => {
          const cellStyle = {
            backgroundColor: MarutiWhite,
            wordWrap: "break-word",
            overflowWrap: "anywhere",
            width: `${column?.width}vw`,
            minWidth: `${column?.width}vw`,
            maxWidth: `${column?.width}vw`,
          };

          return (
            <TableCell key={index.toString()} sx={cellStyle}>
              <TableCellData item={tableData[column.value]} column={column} />
            </TableCell>
          );
        })}
      </TableRow>
    </Fragment>
  );
};

export default TableData;
