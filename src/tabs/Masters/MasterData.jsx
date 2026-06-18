import CircleIcon from "@mui/icons-material/Circle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, TableCell, TableRow, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DownloadIcon from "../../assets/icons/Download.svg";
import DownloadIconWhite from "../../assets/icons/DownloadWhite.svg";
import DownloadProgress from "../../components/DownloadProgress/DownloadProgress.component";
import { getShop } from "../../redux/Reducers/PressShopReducer";
import { downloadMaster } from "../../Repository/MasterRepository";
import { formatDateTime } from "../../utils/helperFunctions.utils";
import useStyles from "./Master.styles";
import CustomPopoverDialog from "./PopoverDialog";

const getColor = (val) => {
  switch (val) {
    case "APPROVED":
      return "Green";
    case "REVIEW_PENDING":
      return "Yellow";
    case "UPLOAD_FAILED":
      return "Grey.main";
    case "UPLOAD_IN_PROGRESS":
      return "Green";
    case "REJECTED":
      return "Red";
    default:
      return "Red";
  }
};
const MasterData = ({ columnWidth = {}, row = {}, approved = {} }) => {
  const [openDownload, setOpenDownload] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [hovered, setHovered] = useState(false);
  const classes = useStyles();
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const shop = useSelector(getShop);

  useEffect(() => {
    if (row.version === approved?.version) {
      setHovered(true);
    }
  }, [row]);

  const handleOpenDownload = () => {
    setOpenDownload(true);
  };
  const handleCloseDownload = () => {
    setOpenDownload(false);
  };

  const handlepopperClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopperClose = () => {
    setAnchorEl(null);
  };

  const downloadReport = (options) => {
    const payload = {
      shop_id: shop?.id,
      file_type: "Master",
      file_path: row.master_file_path,
      file_name: row.master_file_path,
    };
    return downloadMaster(payload, options);
  };

  return (
    <Fragment>
      <TableRow sx={{ m: 1, p: 1 }} className={hovered ? "active" : ""}>
        <TableCell align="left" sx={{ width: columnWidth.version }}>
          {row.version}
        </TableCell>
        <TableCell align="left" sx={{ width: columnWidth.masterfile }}>
          {row.master_file_path}
        </TableCell>
        <TableCell align="left" sx={{ width: columnWidth.uploadedby }}>
          {row.uploader_user_id}
        </TableCell>
        <TableCell align="left" sx={{ width: columnWidth.uploadedon }}>
          {formatDateTime(row.upload_date_time, "DD-MM-YYYY hh:mm A")}
        </TableCell>
        <TableCell align="left" sx={{ width: columnWidth.receivedon }}>
          {formatDateTime(row.review_initiated_date, "DD-MM-YYYY hh:mm A")}
        </TableCell>
        <TableCell align="left" sx={{ width: columnWidth.receivedby }}>
          {row.reviewer_id}
        </TableCell>
        <TableCell align="left" sx={{ width: columnWidth.receivedon }}>
          {formatDateTime(row.review_date, "DD-MM-YYYY hh:mm A")}
        </TableCell>

        <TableCell
          align="left"
          sx={{ width: columnWidth.status, alignItems: "center" }}
        >
          <Box
            className={classes["container-flex"]}
            sx={{ alignItems: "center", gap: "0.8rem", width: "fit-content" }}
          >
            <CircleIcon fontSize="small" color={getColor(row.file_status)} />
            <Typography sx={{ whiteSpace: "nowrap" }}>
              {row.file_status}
            </Typography>
            {row.file_status === "UPLOAD_FAILED" && (
              <InfoOutlinedIcon
                fontSize="large"
                color="Blue"
                onClick={handlepopperClick}
                sx={{ cursor: "pointer" }}
              />
            )}
          </Box>
        </TableCell>

        {/* <TableCell align="center" sx={{ width: columnWidth.download }}>
          <img
            alt="download"
            src={hovered ? DownloadIconWhite : DownloadIcon}
            onClick={handleOpenDownload}
            style={{ cursor: "pointer", height: "1.602rem", width: "1.6rem" }}
          />
        </TableCell> */}
      </TableRow>
      {openDownload && (
        <DownloadProgress
          clickaway={false}
          open={openDownload}
          endpoint={downloadReport}
          downloadName={"Master_Data"}
          onClose={handleCloseDownload}
        />
      )}
      <CustomPopoverDialog
        id={id}
        open={open}
        handleClose={handlePopperClose}
        anchorEl={anchorEl}
        message={row?.errorMessages}
      />
    </Fragment>
  );
};
export default MasterData;
