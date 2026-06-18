import { Box, DialogContent, Divider, Typography } from "@mui/material";
import React from "react";
import FailIcon from "../../../assets/icons/failed.svg";
import SuccessIcon from "../../../assets/icons/success.svg";
import { TypePrimary, TypeSecondary } from "../../../utils/colors";
import ButtonContainer from "../../ButtonContainer/ButtonContainer";
import PrimaryButton from "../../Buttons/PrimaryButton/PrimaryButton";
import DialogCard from "../../DialogCard/DialogCard.component";
import useStyles from "./UploadStatusDialog.styles";

const UploadStatusDialog = ({
  open,
  onClose,
  type = "ERROR",
  message = "Upload unsuccessful.",
  clickaway = false,
  alerts = [],
  closable = false,
}) => {
  const classes = useStyles();

  return (
    <DialogCard
      clickaway={clickaway}
      open={open}
      handleClose={onClose}
      maxWidth={"sm"}
      fullWidth={true}
      title={"Upload File"}
      sx={{ color: TypeSecondary }}
      closable={closable}
    >
      <DialogContent>
        <Box className={classes["prodigi-upload-status-section"]}>
          <Box className={classes["prodigi-upload-status-description"]}>
            <Typography sx={{ color: TypePrimary }}>{message}</Typography>
            <img
              style={{ height: "2.4rem", width: "2.4rem" }}
              alt=""
              src={type === "ERROR" ? FailIcon : SuccessIcon}
            />
          </Box>
          {type === "ERROR" && (
            <Box>
              <Typography variant="h5" sx={{ color: TypeSecondary, mb: 0.8 }}>
                Reasons
              </Typography>
              <Box className={classes["prodigi-status-data-container"]}>
                {alerts && alerts?.length > 0 ? (
                  alerts?.map((reason, index) => (
                    <Box
                      key={index}
                      className={classes["prodigi-upload-status-description"]}
                      sx={{ paddingRight: "10rem" }}
                    >
                      <Typography sx={{ color: TypePrimary, mr: "2rem" }}>
                        {reason}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Box
                    className={classes["prodigi-upload-status-description"]}
                    sx={{ paddingRight: "10rem" }}
                  >
                    <Typography sx={{ color: TypePrimary, mr: "2rem" }}>
                      No error information
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
          <Divider sx={{ mb: 0.8 }} />
        </Box>
        <ButtonContainer>
          <PrimaryButton sx={{ width: "11.6rem !important" }} onClick={onClose}>
            OK
          </PrimaryButton>
        </ButtonContainer>
      </DialogContent>
    </DialogCard>
  );
};
export default UploadStatusDialog;
