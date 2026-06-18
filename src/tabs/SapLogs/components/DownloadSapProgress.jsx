import { DialogContent } from "@mui/material";
import Box from "@mui/material/Box";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import styled from "@mui/material/styles/styled";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import _ from "lodash";
import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SecondaryButton from "../../../components/Buttons/SecondaryButton/SecondaryButton";
import DialogCard from "../../../components/DialogCard/DialogCard.component";
import { setApplicationAlert } from "../../../redux/Actions/AlertActions";
import {
  Grey10,
  MarutiWhite,
  StatusDone,
  StatusGreen,
  StatusRed,
} from "../../../utils/colors";
import {
  getErrorMessage,
  sapFileName,
} from "../../../utils/helperFunctions.utils";
import { getShop } from "../../../redux/Reducers/PressShopReducer";

const useStyles = makeStyles((theme) => ({
  "download-modal-container": {
    display: "flex",
    flex: 5,
    alignItems: "center",
    gap: "1rem",
    padding: "1rem",
    border: "1px solid #e6e9f0",
    borderRadius: "4px",
  },
  "download-modal-progress": {
    flex: 4,
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1rem",
    height: "3.2rem",
    borderRadius: "0.4rem",
    backgroundColor: Grey10,
  },
}));

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 9,
  borderRadius: 5,

  //Empty Background Color
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: MarutiWhite,
  },
  //Filled Background Color
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: [5, 5],
    backgroundColor: StatusDone,
  },
}));

const initialInfo = {
  progress: 0,
  completed: false,
  total: 0,
  loaded: 0,
};

const DownloadSapProgress = ({
  open = false,
  onClose = () => {},
  endpoint = () => {},
  logType = "",
}) => {
  const classes = useStyles();
  const ref = useRef();
  const [downloadInfo, setDownloadInfo] = useState(initialInfo);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  const shop = useSelector(getShop);

  useEffect(() => {
    onDownload();
    ref.current = setInterval(() => {
      setDownloadInfo((prevState) => {
        const newProgress = prevState.progress + 1;
        return {
          ...prevState,
          progress: newProgress > 90 ? 90 : newProgress,
        };
      });
    }, 150);
    return () => {
      clearInterval(ref?.current);
    };
  }, []);

  const onDownload = () => {
    endpoint()
      .then(function (res) {
        const blob = new Blob([res?.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const fileName = sapFileName(logType, shop?.name);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        setDownloadInfo((info) => ({
          ...info,
          completed: true,
          progress: 100,
        }));
        clearInterval(ref?.current);
      })
      .catch((ex) => {
        setError(true);
        const message = getErrorMessage(ex);
        const params = {
          open: true,
          message: "Download Failed: " + message,
          type: "ERROR",
        };
        dispatch(setApplicationAlert(params));
        setDownloadInfo((prevState) => {
          const newProgress = prevState.progress + 1;
          return {
            ...prevState,
            progress: newProgress > 100 ? 100 : newProgress,
            completed: true,
          };
        });
        clearInterval(ref?.current);
      });
  };

  return (
    <Fragment>
      <DialogCard
        open={open}
        handleClose={onClose}
        maxWidth={"sm"}
        fullWidth={true}
        title={"Downloading In Progress"}
      >
        <DialogContent>
          <Box className={classes["download-modal-container"]}>
            <Box className={classes["download-modal-progress"]}>
              <Typography
                variant="h5"
                color="Blue.main"
                sx={{ fontWeight: "bold" }}
              >
                {downloadInfo?.progress + "%"}
              </Typography>
              <Box sx={{ flex: 1 }}>
                <BorderLinearProgress
                  sx={{
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: error ? StatusRed : StatusGreen,
                    },
                  }}
                  variant="determinate"
                  value={downloadInfo?.progress}
                />
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <SecondaryButton
                disabled={!downloadInfo?.completed}
                type="button"
                onClick={onClose}
              >
                Ok
              </SecondaryButton>
            </Box>
          </Box>
        </DialogContent>
      </DialogCard>
    </Fragment>
  );
};
export default DownloadSapProgress;
