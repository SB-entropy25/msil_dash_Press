import { TableCell, TableRow } from "@mui/material";
import _ from "lodash";
import { useState } from "react";
import { MarutiBlue500 } from "../../../../utils/colors";
import {
  differenceGreaterThan48,
  formatDateTime,
} from "../../../../utils/helperFunctions.utils";
import ReworkDialogCard from "./ReworkDialogCard";

const TableData = ({ row = {}, columnWidth, onSubmitSuccess = () => {} }) => {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <TableRow>
      <TableCell align="left" sx={{ width: columnWidth.machine }}>
        {row?.machine}
      </TableCell>
      <TableCell align="left" sx={{ width: columnWidth.part_name }}>
        {row?.part_name}
      </TableCell>
      <TableCell align="left" sx={{ width: columnWidth.shift }}>
        {row?.shift}
      </TableCell>
      <TableCell align="left" sx={{ width: columnWidth.start_time }}>
        {formatDateTime(row?.start_time, "DD-MM-YY | hh:mm:ss A")}
      </TableCell>
      <TableCell align="left" sx={{ width: columnWidth.end_time }}>
        {formatDateTime(row?.end_time, "DD-MM-YY | hh:mm:ss A")}
      </TableCell>
      <TableCell align="left" sx={{ width: columnWidth.batch_id }}>
        {row?.batch_id}
      </TableCell>
      <TableCell align="left" sx={{ width: columnWidth.prod_qty }}>
        {row?.prod_qty}
      </TableCell>
      <TableCell align="left" sx={{ width: columnWidth.rework_qty }}>
        {row?.rework_qty}
      </TableCell>
      <TableCell align="left" sx={{ width: columnWidth.prework_qty }}>
        {row?.pending_rework_qty || 0}
      </TableCell>
      <TableCell align="left" sx={{ width: columnWidth.status }}>
        {_.capitalize(row?.status)}
      </TableCell>
      <TableCell
        align="left"
        sx={{
          width: columnWidth.pro_updation,
          color: MarutiBlue500,
          cursor: "pointer",
        }}
        onClick={() => setOpenDialog(true)}
      >
        {row?.status === "SUBMITTED" ? "View" : "View/Update"}
      </TableCell>
      {openDialog && (
        <ReworkDialogCard
          open={openDialog}
          row={row}
          isSubmitted={row?.status === "SUBMITTED"}
          withinTimeLimit={!differenceGreaterThan48(row?.start_time)}
          onClose={() => setOpenDialog(false)}
          onSubmitSuccess={onSubmitSuccess}
        />
      )}
    </TableRow>
  );
};
export default TableData;
