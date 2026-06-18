import { Box, DialogContent, Typography } from "@mui/material";
import React from "react";
import { Grey30, MarutiBlue500, TypeTertiary } from "../../../utils/colors";
import PrimaryButton from "../../Buttons/PrimaryButton/PrimaryButton";
import DialogCard from "../../DialogCard/DialogCard.component";
import useStyles from "./UploadDialog.styles";

const labelStyles = {
  borderRadius: "0.4rem",
  height: "3.2rem",
  display: "flex",
  width: "100%",
  alignItems: "center",
  border: `1px solid ${Grey30}`,
  paddingLeft: "1.2rem",
  color: TypeTertiary,
  backgroundColor: "fff",
  display: "flex",
  justifyContent: "space-between",
  paddingRight: "0.5rem",
};

const UploadDialog = ({
  open = false,
  onClose = () => {},
  placeholder,
  fileName,
  handleFileChange,
  inputRef,
  handleUpload,
  loading = false,
  clickaway = false,
  file,
}) => {
  const classes = useStyles();
  const checkInValid = () => {
    const fileType = file.type;
    if (
      fileType === "application/vnd.ms-excel" || // .xls
      fileType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return false;
    }
    return true;
  };
  return (
    <DialogCard
      open={open}
      handleClose={onClose}
      maxWidth={"sm"}
      fullWidth={true}
      title={"Upload Production Sequence"}
      sx={{ color: MarutiBlue500 }}
      variant="h4"
      clickaway={clickaway}
    >
      <DialogContent>
        <Box className={classes["prodigi-upload-container"]}>
          <label htmlFor="file_upload" style={labelStyles}>
            <Typography variant="body1">{fileName}</Typography>
          </label>

          <input
            accept=".xls, .xlsx, .csv"
            className="bulk-file-upload"
            type="file"
            id="file_upload"
            name="file"
            onChange={handleFileChange}
            ref={inputRef}
          />
          <Box sx={{ width: "fit-content" }}>
            <PrimaryButton
              disabled={fileName === placeholder || checkInValid()}
              onClick={handleUpload}
            >
              Upload
            </PrimaryButton>
          </Box>
        </Box>
      </DialogContent>
    </DialogCard>
  );
};
export default UploadDialog;
