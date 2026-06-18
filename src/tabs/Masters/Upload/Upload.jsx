import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import AddIcon from "../../../assets/icons/add.svg";
import TransparentButton from "../../../components/Buttons/TransparentButton/TransparentButton";
import { getShop } from "../../../redux/Reducers/PressShopReducer";
import useStyles from "../Master.styles";
import ConfirmDialog from "./ConfirmDialog";

const placeholder = "Browse the file";
const initialFile = {
  name: placeholder,
  size: "",
  lastModified: "",
  type: "",
  webkitRelativePath: "",
  filename: "",
};
const Upload = (props) => {
  const classes = useStyles();
  const inputRef = useRef(null);

  const [fileName, setFileName] = useState(placeholder);
  const [file, setFile] = useState(initialFile);
  const [confirm, setConfirm] = useState(false);

  const shop = useSelector(getShop);

  useEffect(() => {
    inputRef.current.value = null;
    setFile(initialFile);
    setFileName(placeholder);
  }, [shop]);

  const handleFileChange = (event) => {
    var file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setFile(file);
    }
  };

  const handleConfirmDialogOpen = () => {
    setConfirm(true);
  };

  const handleConfirmDialogClose = () => {
    inputRef.current.value = null;
    setFile(initialFile);
    setFileName(placeholder);
    setConfirm(false);
  };

  return (
    <Box
      className={classes["container-flex"]}
      sx={{
        gap: "0.8rem",
      }}
    >
      <label
        htmlFor="press_file_upload"
        className={classes["prodigi-file-container"]}
        style={{
          backgroundColor: "#ffffff",
          width: "40rem",
          display: "flex",
          justifyContent: "space-between",
          paddingRight: "0.5rem",
        }}
      >
        <Typography variant="body1">{fileName}</Typography>
        <img src={AddIcon} height="16rem" width="16rem" />
      </label>
      <input
        className="prodigi-file-upload"
        type="file"
        id="press_file_upload"
        name="file"
        onChange={handleFileChange}
        ref={inputRef}
      />
      <Box sx={{ width: "fit-content" }}>
        <TransparentButton
          disabled={fileName === placeholder}
          onClick={handleConfirmDialogOpen}
        >
          Upload
        </TransparentButton>
      </Box>
      <ConfirmDialog
        open={confirm}
        handleClose={handleConfirmDialogClose}
        onUpload={props.onUpload}
        file={file}
      />
    </Box>
  );
};
export default Upload;
