import { DialogContent } from "@mui/material";
import Box from "@mui/material/Box";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import styled from "@mui/material/styles/styled";
import Typography from "@mui/material/Typography";
import { Fragment } from "react";
import useStyles from "../../tabs/Masters/Master.styles";
import {
  MarutiWhite,
  StatusDone,
  StatusGreen,
  StatusRed,
} from "../../utils/colors";
import SecondaryButton from "../Buttons/SecondaryButton/SecondaryButton";
import DialogCard from "../DialogCard/DialogCard.component";

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

const Download = ({
  open = false,
  onClose = () => {},
  downloadInfo = initialInfo,
  error = false,
}) => {
  const classes = useStyles();

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
export default Download;
