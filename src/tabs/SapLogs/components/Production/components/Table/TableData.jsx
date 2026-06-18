import { Circle } from "@mui/icons-material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, TableCell, TableRow, Typography } from "@mui/material";
import { Fragment, useState } from "react";
import {
  Grey80,
  MarutiBlue500,
  MarutiWhite,
  StatusAlertSevere,
  StatusGreen,
  Yellow,
} from "../../../../../../utils/colors";
import { formatDateTime } from "../../../../../../utils/helperFunctions.utils";
import EditModal from "../EditModal/EditModal";
import SapPopoverDialog from "./SapPopoverDialog";

const colorMap = {
  FAILURE: StatusAlertSevere,
  IN_PROCESS: Yellow,
  SUCCESS: StatusGreen,
};

const statusText = {
  FAILURE: "Failure",
  IN_PROCESS: "In Process",
  SUCCESS: "Success",
};

const TableData = ({
  tableData,
  filters,
  filteredData,
  handleUpdateSuccess = () => {},
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [isEditData, setEditData] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const isFailure = tableData?.status === "FAILURE";

  const handleClose = () => {
    setOpenModal(false);
  };

  const formatTime = (datetime) => {
    return formatDateTime(datetime, "DD-MM-YY | hh:mm:ss a");
  };

  const handlepopperClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopperClose = () => {
    setAnchorEl(null);
  };

  const cellStyle = {
    backgroundColor: MarutiWhite,
    wordWrap: "break-word",
    overflowWrap: "anywhere",
  };

  let lastIndex = tableData?.attempts?.length - 1;
  lastIndex = lastIndex || 0;

  const attempts = tableData?.attempts?.[lastIndex]?.attempt_number || 0;

  const status = tableData?.status
    ? `${statusText[tableData.status] || ""} (${attempts})`
    : "";

  const errorRemarks = tableData?.attempts?.[lastIndex]?.error_remarks || "-";

  const arrKeywords = ["BTC-COMMON", "POODATAUSER"];
  const isKeywordExist = arrKeywords.some((keyword) =>
    errorRemarks.includes(keyword)
  );

  const isRepushDisabled =
    !isFailure ||
    (isKeywordExist && attempts < 3) ||
    errorRemarks.includes(
      "Data is already processed with Confirmation of order"
    );

  const handleEdit = (edit = false) => {
    if (isRepushDisabled) {
      return null;
    }
    setOpenModal(true);
    setEditData(edit);
  };

  const actionStyle = {
    color: !isRepushDisabled ? MarutiBlue500 : Grey80,
    cursor: isRepushDisabled ? "auto" : "pointer",
  };

  return (
    <Fragment>
      <TableRow>
        <TableCell sx={cellStyle}>
          <Typography>{tableData?.machine}</Typography>
        </TableCell>
        <TableCell sx={cellStyle}>
          <Typography>{tableData?.program_no}</Typography>
        </TableCell>
        <TableCell sx={cellStyle}>
          <Typography>{tableData?.program_name}</Typography>
        </TableCell>
        <TableCell sx={cellStyle}>
          <Typography>{tableData?.model}</Typography>
        </TableCell>
        <TableCell sx={cellStyle}>
          <Typography>{tableData?.shift}</Typography>
        </TableCell>
        <TableCell sx={cellStyle}>
          <Typography>{formatTime(tableData?.data_capture_time)}</Typography>
        </TableCell>
        <TableCell sx={cellStyle}>
          <Box sx={{ display: "flex", gap: 0.8, alignItems: "center" }}>
            <Typography>{formatTime(tableData?.data_update_time)}</Typography>
            <InfoOutlinedIcon
              fontSize="medium"
              color="#9EA1A7"
              onClick={handlepopperClick}
              sx={{ cursor: "pointer" }}
            />
          </Box>
        </TableCell>
        <TableCell sx={cellStyle}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Circle
              fontSize="small"
              htmlColor={colorMap[tableData.status] || "white"}
              sx={{ marginRight: 1 }}
            />
            <Typography>{status}</Typography>
          </Box>
        </TableCell>
        <TableCell sx={cellStyle}>
          <Typography>{errorRemarks}</Typography>
        </TableCell>
        <TableCell sx={cellStyle}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            <Typography
              sx={actionStyle}
              onClick={() => handleEdit(false)}
              disabled={isRepushDisabled}
            >
              Repush
            </Typography>
            <Typography sx={actionStyle} disabled={true}>
              |
            </Typography>
            <Typography
              sx={actionStyle}
              onClick={() => handleEdit(true)}
              disabled={isRepushDisabled}
            >
              Edit
            </Typography>
          </Box>
        </TableCell>
      </TableRow>
      {openModal && (
        <EditModal
          open={openModal}
          onClose={handleClose}
          isEditData={isEditData}
          modalData={tableData}
          filters={filters}
          logsData={filteredData}
          handleUpdateSuccess={() => {
            handleClose();
            handleUpdateSuccess();
          }}
        />
      )}
      <SapPopoverDialog
        id={id}
        open={open}
        handleClose={handlePopperClose}
        anchorEl={anchorEl}
        attempts={tableData?.attempts || []}
      />
    </Fragment>
  );
};

export default TableData;
