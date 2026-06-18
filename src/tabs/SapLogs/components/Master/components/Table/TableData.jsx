import { Circle } from "@mui/icons-material";
import {
  Box,
  styled,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { Fragment, useState } from "react";
import Download from "../../../../../../assets/icons/Download.svg";
import download_image from "../../../../../../assets/icons/download_image.svg";
import infoIcon from "../../../../../../assets/icons/infoIcon.svg";
import {
  StatusAlertSevere,
  StatusGreen,
  Yellow,
} from "../../../../../../utils/colors";
import { formatDateTime } from "../../../../../../utils/helperFunctions.utils";
import { masterColumn } from "./MasterColumn";
import DownloadProgress from "../../../../../../components/DownloadProgress/DownloadProgress.component";

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

const TooltipContent = ({ title, description }) => (
  <div>
    <Typography variant="body2" fontWeight="bold" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body2">{description} </Typography>
  </div>
);

const formatTime = (datetime) => {
  return formatDateTime(datetime, "DD-MM-YYYY | hh:mm:ss a");
};

const TableData = ({ tableData }) => {
  const [openDownload, setOpenDownload] = useState(false);
  const isEnabled = tableData?.enabled;

  const downloadMaster = () => {};

  const TableCellData = ({ column = {}, item = "" }) => {
    switch (column?.value) {
      case "error_details":
        return (
          <CustomTooltip
            title={
              <TooltipContent
                title={"File Error Detail:"}
                description={item || ""}
              />
            }
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img src={infoIcon} />
            </Box>
          </CustomTooltip>
        );
      case "master_file":
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => setOpenDownload(true)}
          >
            <img
              src={isEnabled ? download_image : Download}
              style={{ height: "1.6rem" }}
            />
          </Box>
        );
      case "processing_status":
        return (
          <Box sx={{ display: "flex", gap: 0.2 }}>
            <Circle
              fontSize="small"
              htmlColor={colorMap[tableData.processing_status] || "gray"}
              sx={{ marginRight: 1 }}
            />
            <Typography>{statusText[item]}</Typography>
          </Box>
        );
      case "file_name":
        return <Typography>{item}</Typography>;

      case "received_at":
        return <Typography noWrap>{formatTime(item)}</Typography>;
      default:
        return item;
    }
  };

  const sortedColumns = Object.values(masterColumn).sort(
    (a, b) => a.index - b.index
  );

  const bgColor = isEnabled ? "#F2F2FF" : "white";
  return (
    <Fragment>
      <TableRow
        hover={false}
        sx={{
          backgroundColor: bgColor,
          "&:hover": { backgroundColor: `${bgColor} !important` },
        }}
      >
        {sortedColumns.map((column, index) => {
          const cellStyle = {
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
      {openDownload && (
        <DownloadProgress
          clickaway={false}
          open={openDownload}
          endpoint={downloadMaster}
          downloadName={"SAP_Master"}
          onClose={() => setOpenDownload(false)}
        />
      )}
    </Fragment>
  );
};

export default TableData;
