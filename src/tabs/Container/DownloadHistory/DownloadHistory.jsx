import { Close } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProdigiContext } from "../../../App";
import download_image from "../../../assets/icons/download_image.svg";
import ArrowTooltip from "../../../components/ArrowTooltip/ArrowTooltip";
import PrimaryButton from "../../../components/Buttons/PrimaryButton/PrimaryButton";
import Download from "../../../components/Download/Download";
import Select from "../../../components/Select/SiteSelect";
import { setApplicationAlert } from "../../../redux/Actions/AlertActions";
import { getDownloadHistory } from "../../../redux/Actions/FiltersActions";
import { getShop } from "../../../redux/Reducers/PressShopReducer";
import {
  selectHistoryReportId,
  selectHistoryReportIdLoading,
} from "../../../redux/Selectors/FiltersSelector";
import {
  downloadInProgress,
  downloadStatus,
} from "../../../Repository/FiltersRepository";
import { MarutiSilver400, TypeSecondary } from "../../../utils/colors";
import { getDownloadShops } from "../../../services/auth";

const initialInfo = {
  progress: 0,
  completed: false,
  total: 0,
  loaded: 0,
};

const DOWNLOAD_POLLING_TIME = 10000;
const TABLE_OPTIONS = {
  Batch: "iot_psm_msil_batch",
  Downtime: "iot_psm_msil_downtime",
  "Machine Telemetry": "iot_psm_msil_machine_telemetry",
  "Quality Punching": "iot_psm_msil_quality_punching",
};
const DownloadHistory = () => {
  const shop = useSelector(getShop);
  const dispatch = useDispatch();

  const [toDate, setToDate] = useState("");
  const [error, setError] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDownload, setOpenDownload] = useState(false);
  const [downloadInfo, setDownloadInfo] = useState(initialInfo);
  const [statusFetchInterval, setStatusFetchInterval] = useState(null);

  const downloadReportId = useSelector(selectHistoryReportId);
  const downloadReportIdLoading = useSelector(selectHistoryReportIdLoading);
  const context = useContext(ProdigiContext);
  const downloadShops = getDownloadShops();

  const handleIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setFromDate("");
    setToDate("");
    setSelectedTable("");
    setDownloadInfo(initialInfo);

    if (statusFetchInterval) {
      clearInterval(statusFetchInterval);
      setStatusFetchInterval(null);
      dispatch(setApplicationAlert("Downloading cancelled"));
    }
  };

  const onDownload = () => {
    if (shop?.id) {
      const payload = {
        module: "prodigi_1",
        shop_id: `shop_${shop?.id}`,
        table: TABLE_OPTIONS[selectedTable],
        start_date: fromDate,
        end_date: toDate,
      };
      dispatch(getDownloadHistory(payload));
      setOpenDownload(true);
    }
  };

  useEffect(() => {
    let progress = 0;
    if (
      !downloadReportIdLoading &&
      downloadReportId?.message === "Success" &&
      openDownload
    ) {
      downloadInProgress({
        module: "prodigi_1",
        shop_id: `shop_${shop?.id}`,
        start_date: fromDate,
        end_date: toDate,
        table: TABLE_OPTIONS[selectedTable],
        report_id: downloadReportId?.reportId,
      })
        .then(function (response) {})
        .catch((ex) => {});
      const fetchStatus = () => {
        const payload = {
          report_id: downloadReportId?.reportId,
          shop_id: `shop_${shop?.id}`,
          module: "prodigi_1",
        };

        downloadStatus(payload)
          .then((response) => {
            const reportStatus = response?.data?.reportStatus;

            if (reportStatus === "COMPLETE") {
              clearInterval(statusFetchInterval); // Stop polling
              const url = response?.data?.downloadUrl;
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", "file");
              document.body.appendChild(link);
              link.click();

              setDownloadInfo((info) => ({
                ...info,
                completed: true,
                progress: 100,
              }));
            } else if (reportStatus === "ERROR") {
              clearInterval(statusFetchInterval); // Stop polling
              handleError("No Data Found!");
            } else if (reportStatus === "IN PROGRESS") {
              progress = Math.min(progress + 5, 80);
              setDownloadInfo((info) => ({
                ...info,
                progress: progress,
              }));
            }
          })
          .catch((ex) => {
            handleError(ex?.response?.data?.message || ex?.message);
          });
      };

      const statusFetchInterval = setInterval(
        fetchStatus,
        DOWNLOAD_POLLING_TIME
      );
      setStatusFetchInterval(statusFetchInterval);

      return () => clearInterval(statusFetchInterval);
    }
  }, [downloadReportId, downloadReportIdLoading]);

  const handleError = (message) => {
    setError(true);
    setDownloadInfo(initialInfo);
    setOpenDownload(false);
    clearInterval(statusFetchInterval);
    handleClose();

    const params = {
      open: true,
      message,
      type: "ERROR",
    };
    dispatch(setApplicationAlert(params));
  };
  const checkAccess = () => {
    if (downloadShops?.includes(String(shop?.id))) {
      return true;
    }
    return false;
  };

  return (
    <Box>
      <IconButton onClick={handleIconClick} disableRipple>
        <ArrowTooltip
          show={!checkAccess()}
          message="You don't have download access for this shop"
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src={download_image}
              style={{
                height: "1.8rem",
                width: "1.8rem",
                cursor: "pointer",
                pointerEvents: !checkAccess() ? "none" : "inherit",
              }}
            />
            <Typography
              variant="body1"
              sx={{
                color: TypeSecondary,
                ml: "0.8rem",
                display: "inline-block",
                fontWeight: 400,
              }}
            >
              Download
            </Typography>
          </Box>
        </ArrowTooltip>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            style: {
              width: 265,
              marginTop: "3.4rem",
            },
          },
        }}
      >
        <Box
          sx={{
            mt: "0rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="body1" sx={{ color: TypeSecondary }}>
            Download History
          </Typography>
          <Close
            onClick={handleClose}
            sx={{ color: MarutiSilver400, cursor: "pointer" }}
          />
        </Box>
        <Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              width: "250px",
              mt: "1rem",
            }}
          >
            <Box>
              <TextField
                slotProps={{
                  input: {
                    startAdornment: (
                      <span
                        style={{
                          marginLeft: "0.2rem",
                          marginRight: "0.4rem",
                          marginTop: "0rem",
                        }}
                        className="select-label font-regular font-normal"
                      >
                        Start Date:
                      </span>
                    ),
                    max:
                      toDate ||
                      new Date(new Date().setDate(new Date().getDate() - 1))
                        .toISOString()
                        .split("T")[0],
                  },
                  inputLabel: {
                    shrink: true,
                  },
                }}
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                fullWidth
              />
            </Box>
            <Box>
              <TextField
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <span
                        style={{
                          marginLeft: "0.2rem",
                          marginRight: "0.4rem",
                          marginTop: "0rem",
                        }}
                        className="select-label font-regular font-normal"
                      >
                        End Date:
                      </span>
                    ),
                    min: fromDate,
                    max: new Date().toISOString().split("T")[0],
                  },
                  inputLabel: {
                    shrink: true,
                  },
                }}
                disabled={!fromDate}
              />
            </Box>
            <Box sx={{ minWidth: "18rem" }}>
              <Select
                label="Table"
                onChange={(e) => setSelectedTable(e.target.value)}
                value={selectedTable}
              >
                {Object.keys(TABLE_OPTIONS).map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box
              sx={{
                width: "35px",
                display: "flex",
                justifyContent: "flex-end",
                alignSelf: "flex-end",
              }}
            >
              <PrimaryButton
                onClick={onDownload}
                disabled={!fromDate || !toDate || !selectedTable}
              >
                Download
              </PrimaryButton>
            </Box>
          </Box>
          {openDownload && (
            <Download
              clickaway={false}
              error={error}
              open={openDownload}
              downloadInfo={downloadInfo}
              onClose={() => {
                setOpenDownload(false);
                setDownloadInfo(initialInfo);
                setError(false);
                setTimeout(() => {
                  handleClose();
                }, 300);
              }}
            />
          )}
        </Box>
      </Menu>
    </Box>
  );
};

export default DownloadHistory;
