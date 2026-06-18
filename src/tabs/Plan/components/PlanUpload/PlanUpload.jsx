import Box from "@mui/material/Box";
import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProdigiContext } from "../../../../App";
import DownloadIcon from "../../../../assets/icons/DownloadReport.svg";
import RefreshIcon from "../../../../assets/icons/Refresh.svg";
import ArrowTooltip from "../../../../components/ArrowTooltip/ArrowTooltip";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton/PrimaryButton";
import DownloadProgress from "../../../../components/DownloadProgress/DownloadProgress.component";
import InProgressDialog from "../../../../components/Upload/InProgressDialog/InProgressDialog";
import UploadDialog from "../../../../components/Upload/UploadDIalog/UploadDialog";
import UploadStatusDialog from "../../../../components/Upload/UploadStatusDialog/UploadStatusDialog";
// import { fetchAllNotifications } from "../../../../redux/Actions/NotificationsActions";
import {
  fetchPlanAlerts,
  setUploadPlanStatus,
} from "../../../../redux/Actions/PlanActions";
import { getShop } from "../../../../redux/Reducers/PressShopReducer";
import { selectPlanAlerts } from "../../../../redux/Selectors/PlanSelector";
import {
  downloadPlan,
  downloadReport,
  uploadPlan,
} from "../../../../Repository/PlanRepository";
import { getUser } from "../../../../services/auth";
import {
  listResult,
  selectResult,
} from "../../../../utils/helperFunctions.utils";
import { statusMapper } from "../../../../utils/mapper";
import useStyles from "../../Plan.styles";

const placeholder = "Browse the file";
const initialFile = {
  name: placeholder,
  size: "",
  lastModified: "",
  type: "",
  webkitRelativePath: "",
  filename: "",
};

const initialInfo = {
  progress: 0,
  completed: false,
  total: 0,
  loaded: 0,
};

const PlanUpload = ({ filters, sort, onRefresh = () => {} }) => {
  const classes = useStyles();
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [apiCalled, setApiCalled] = useState(false);
  const [fileName, setFileName] = useState(placeholder);
  const [file, setFile] = useState(initialFile);
  const [uploading, setUploading] = useState(false);
  const [openDownload, setOpenDownload] = useState(false);
  const [openReportDownload, setOpenReportDownload] = useState(false);
  const [openStatusError, setOpenStatusError] = useState(false);
  const [openStatusSuccess, setOpenStatusSuccess] = useState(false);
  const [uploadInfo, setUploadInfo] = useState(initialInfo);

  const shop = useSelector(getShop);
  const notifications = useSelector(selectPlanAlerts);
  const context = useContext(ProdigiContext);
  const { downloadShops, admin } = context;

  const checkAccess = () => {
    if (downloadShops?.includes(String(shop?.id))) {
      return true;
    }
    return false;
  };

  const downloadLatestReport = (options) => {
    const payload = {
      shop_id: shop?.id,
      shop_name: shop?.shop_name,
      date: notifications?.plan_for_date,
    };
    return downloadReport(payload, options);
  };

  const downloadPlanReport = (options) => {
    const payload = {
      shop_id: shop?.id,
      shop_name: shop?.shop_name,
      machine_list: listResult(filters?.machines),
      model_list: listResult(filters?.models),
      part_name_list: listResult(filters?.part_names),
      pe_code_list: listResult(filters?.pe_codes),
      production_date_list: listResult(filters?.production_dates),
      shift: selectResult(filters?.shift),
      priority: selectResult(filters?.priority),
      status: selectResult(statusMapper[filters?.status]),
      sort_priority: sort,
    };
    return downloadPlan(payload, options);
  };

  const handleFileChange = (event) => {
    var file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setFile(file);
    }
  };

  const handleSubmit = () => {
    setAlerts([]);
    const payload = {
      shop_id: shop?.id,
      shop_name: shop?.shop_name,
    };
    const options = {
      method: "PUT",
      headers: {
        "x-amz-meta-created_by": getUser().username,
        "x-amz-meta-shop_id": shop.id,
        "Content-Type": "multipart/form-data",
      },
      body: file,
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        setUploadInfo({
          progress: Math.floor((loaded * 100) / total),
          loaded,
          total,
          completed: false,
        });
      },
    };
    uploadPlan(payload)
      .then((res) => {
        const url = res?.data?.plan_url;
        fetch(url, options)
          .then((res) => {
            if (res.status === 200) {
              setUploadInfo((info) => ({
                ...info,
                progress: 25,
                completed: false,
              }));
              setTimeout(() => {
                dispatch(
                  fetchPlanAlerts({
                    shop_id: shop?.id,
                  })
                );
                setApiCalled(true);
              }, [10000]);
            } else {
              settingError();
            }
          })
          .catch((ex) => {
            settingError(ex);
          });
      })
      .catch((ex) => {
        settingError(ex);
      });

    setOpen(false);
    inputRef.current.value = null;
    setUploading(true);
  };

  useEffect(() => {
    if (apiCalled) {
      if (["SUCCESS", "FAILED"].includes(notifications?.status)) {
        if (notifications?.status === "SUCCESS") {
          setUploadInfo((info) => ({
            ...info,
            progress: 100,
            completed: true,
          }));
          setOpenStatusSuccess(true);
          setApiCalled(false);
        } else {
          setAlerts(
            notifications?.errors ? [...notifications?.errors?.split(";")] : []
          );
          setError(true);
          setUploadInfo((info) => ({
            ...info,
            progress: 98,
            completed: true,
          }));
          setOpenStatusError(true);
          setApiCalled(false);
        }
        // dispatch(fetchAllNotifications(shop?.id));
      } else {
        setTimeout(() => {
          dispatch(
            fetchPlanAlerts({
              shop_id: shop?.id,
            })
          );
        }, [10000]);
        setUploadInfo((info) => ({
          ...info,
          progress: info.progress < 95 ? info.progress + 2 : info.progress,
          completed: false,
        }));
      }
    }
  }, [notifications]);

  const settingError = (ex) => {
    let alert = ex?.response?.data?.message;
    setError(true);
    setUploadInfo((info) => ({
      ...info,
      progress: 50,
      completed: true,
    }));
    setOpenStatusError(true);
    if (alert) {
      setAlerts([alert]);
    } else {
      setAlerts(["Error occurred while uploading."]);
    }
  };
  const handleUploadingDialogClose = () => {
    setFile(initialFile);
    setFileName(placeholder);
    setUploading(false);
    setUploadInfo(initialInfo);
    setError(false);
    handleClose();
  };

  const handleClose = () => {
    if (inputRef?.current) {
      inputRef.current.value = null;
    }
    setFile(initialFile);
    setFileName(placeholder);
    setUploading(false);
    setOpen(false);
  };

  const handleStatusErrorDialogClose = () => {
    setOpenStatusError(false);
    handleUploadingDialogClose();
  };
  const handleStatusSuccessDialogClose = () => {
    dispatch(setUploadPlanStatus("UPLOADED"));
    setOpenStatusSuccess(false);
    handleUploadingDialogClose();
  };

  return (
    <Box className={classes["container-flex"]}>
      {/* <ArrowTooltip
        show={!checkAccess()}
        message="You don't have download access for this shop"
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <PrimaryButton
            sx={{ width: "fit-content !important" }}
            disabled={!checkAccess() || notifications?.status !== "SUCCESS"}
            onClick={() => setOpenReportDownload(true)}
          >
            Download Latest Data
          </PrimaryButton>
        </Box>
      </ArrowTooltip>
      <ArrowTooltip
        show={!admin}
        message="You don't have upload access for this shop"
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <PrimaryButton
            sx={{ width: "fit-content !important" }}
            onClick={() => setOpen(true)}
            disabled={!admin}
          >
            Upload
          </PrimaryButton>
        </Box>
      </ArrowTooltip> */}
      <ArrowTooltip
        show={!checkAccess()}
        message="You don't have download access for this shop"
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img
            src={DownloadIcon}
            onClick={() => setOpenDownload(true)}
            alt=""
            style={{
              height: "3.2rem",
              width: "3.2rem",
              cursor: "pointer",
              opacity: !checkAccess() ? "0.5" : "1",
              pointerEvents: !checkAccess() ? "none" : "inherit",
            }}
          />
        </Box>
      </ArrowTooltip>
      <UploadDialog
        clickaway={false}
        open={open}
        onClose={handleClose}
        handleUpload={handleSubmit}
        placeholder={placeholder}
        fileName={fileName}
        file={file}
        inputRef={inputRef}
        handleFileChange={handleFileChange}
      />
      {uploading && (
        <InProgressDialog
          clickaway={false}
          open={uploading}
          error={error}
          uploadInfo={uploadInfo}
          onClose={handleUploadingDialogClose}
        />
      )}
      {openDownload && (
        <DownloadProgress
          clickaway={false}
          open={openDownload}
          endpoint={downloadPlanReport}
          downloadName={"Plan_Report"}
          onClose={() => {
            setOpenDownload(false);
          }}
        />
      )}
      {openReportDownload && (
        <DownloadProgress
          clickaway={false}
          open={openReportDownload}
          endpoint={downloadLatestReport}
          path={["data", "plan_url"]}
          onClose={() => {
            setOpenReportDownload(false);
          }}
        />
      )}
      <UploadStatusDialog
        clickaway={false}
        open={openStatusError}
        alerts={alerts}
        closable={true}
        onClose={handleStatusErrorDialogClose}
      />
      <UploadStatusDialog
        message="Production Sequence Plan uploaded Successfully"
        clickaway={false}
        closable={true}
        open={openStatusSuccess}
        type="SUCCESS"
        onClose={handleStatusSuccessDialogClose}
      />
      <img
        onClick={onRefresh}
        src={RefreshIcon}
        alt=""
        style={{ height: "3.2rem", width: "3.2rem", cursor: "pointer" }}
      />
    </Box>
  );
};
export default PlanUpload;
