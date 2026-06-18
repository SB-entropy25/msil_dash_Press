import { Box, DialogContent, Typography } from "@mui/material";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import React from "react";
import {
  MarutiBlue500,
  MarutiWhite,
  StatusDone,
  StatusGreen,
  StatusRed,
} from "../../../utils/colors";
import DialogCard from "../../DialogCard/DialogCard.component";
import useStyles from "./InProgressDialog.styles";

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

const InProgressDialog = ({
  open = false,
  onClose = () => {},
  uploadInfo = initialInfo,
  error = false,
  clickaway = false,
}) => {
  const classes = useStyles();
  return (
    <DialogCard
      open={open}
      clickaway={clickaway}
      handleClose={onClose}
      maxWidth={"sm"}
      fullWidth={true}
      title={"Uploading is in progress"}
      sx={{ color: MarutiBlue500 }}
      variant="h4"
    >
      <DialogContent>
        <Box className={classes["plan-modal"]}>
          <Box className={classes["download-modal-progress"]}>
            <Typography
              variant="h5"
              color="Blue.main"
              sx={{ fontWeight: "bold" }}
            >
              {uploadInfo?.progress + "%"}
            </Typography>
            <Box sx={{ flex: 1 }}>
              <BorderLinearProgress
                sx={{
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: error ? StatusRed : StatusGreen,
                  },
                }}
                variant="determinate"
                value={uploadInfo?.progress}
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </DialogCard>
  );
};
export default InProgressDialog;
