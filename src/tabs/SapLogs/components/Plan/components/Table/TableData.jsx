import {
  Box,
  styled,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { Fragment, useState } from "react";
import { MarutiWhite } from "../../../../../../utils/colors";
import { planColumns } from "./PlanColumns";
import { formatDateTime } from "../../../../../../utils/helperFunctions.utils";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SapPlanPopoverDialog from "./SapPlanPopoverDialog";

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

const OrderStatus = {
  ORDER_ACCEPTED: "Order updated in IOT",
  ORDER_REJECTED: "Order Rejected",
  ORDER_SAVED: "Order not updated",
};

const TableData = ({ tableData, errorLogs }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handlepopperClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopperClose = () => {
    setAnchorEl(null);
  };

  const formatTime = (datetime) => {
    return formatDateTime(datetime, "DD-MM-YYYY | hh:mm:ss a");
  };

  const TableCellData = ({ column = {}, item = "" }) => {
    switch (column?.value) {
      case "scheduled_finish":
      case "scheduled_start":
        return <Typography>{formatTime(item)}</Typography>;
      case "iot_order_processing_status":
        return <Typography>{OrderStatus[item]}</Typography>;
      default:
        return item;
    }
  };

  const sortedColumns = Object.values(planColumns).sort(
    (a, b) => a.index - b.index
  );

  const fixedCell = {
    position: "sticky",
    zIndex: 3,
    backgroundColor: MarutiWhite,
    wordWrap: "break-word",
    overflowWrap: "anywhere",
    width: `7vw`,
    minWidth: `7vw`,
    maxWidth: `7vw`,
  };
  const borderStyle = {
    borderRight: "5px solid #E6E9F0",
    boxShadow: "2px 0px 2px -2px rgba(0, 0, 0, 0.2)",
  };

  return (
    <Fragment>
      <TableRow>
        <TableCell
          sx={[
            fixedCell,
            { width: `10vw`, minWidth: `10vw`, maxWidth: `10vw`, left: "0vw" },
          ]}
        >
          <CustomTooltip title={tableData?.filename || ""} disableInteractive>
            <Typography>{formatTime(tableData?.data_received_time)}</Typography>
          </CustomTooltip>
        </TableCell>
        <TableCell sx={{ ...fixedCell, left: "10vw" }}>
          <Typography>{tableData?.order_number}</Typography>
        </TableCell>
        <TableCell sx={{ ...fixedCell, left: "17vw" }}>
          <Box sx={{ display: "flex", gap: 0.8, alignItems: "center" }}>
            <Typography>{tableData?.order_status}</Typography>
            {errorLogs?.[tableData?.filename] &&
            tableData?.iot_order_processing_status === "ORDER_REJECTED" ? (
              <InfoOutlinedIcon
                fontSize="medium"
                color="#9EA1A7"
                onClick={handlepopperClick}
                sx={{ cursor: "pointer" }}
              />
            ) : null}
          </Box>
        </TableCell>
        <TableCell sx={{ ...fixedCell, left: "24vw" }}>
          <Typography>{tableData?.order_type}</Typography>
        </TableCell>
        <TableCell sx={{ ...fixedCell, left: "31vw" }}>
          <Typography>{tableData?.mrp_controller}</Typography>
        </TableCell>
        <TableCell sx={[{ ...fixedCell, left: "38vw" }, borderStyle]}>
          <Typography>{tableData?.work_center}</Typography>
        </TableCell>
        {sortedColumns.map((column, index) => {
          const cellStyle = {
            backgroundColor: MarutiWhite,
            wordWrap: "break-word",
            overflowWrap: "anywhere",
            width: `${column?.width}vw`,
            minWidth: `${column?.width}vw`,
            maxWidth: `${column?.width}vw`,
            zIndex: 1,
          };

          return (
            <TableCell key={index.toString()} sx={cellStyle}>
              <TableCellData item={tableData[column.value]} column={column} />
            </TableCell>
          );
        })}
      </TableRow>
      <SapPlanPopoverDialog
        id={id}
        open={open}
        handleClose={handlePopperClose}
        anchorEl={anchorEl}
        errorData={errorLogs?.[tableData?.filename] || []}
      />
    </Fragment>
  );
};

export default TableData;
