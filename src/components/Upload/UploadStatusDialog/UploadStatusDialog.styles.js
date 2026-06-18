import { makeStyles } from "@mui/styles";
import { Grey10, MarutiWhite } from "../../../utils/colors";

const useStyles = makeStyles((theme) => ({
  "prodigi-upload-status-section": {
    display: "flex",
    flexDirection: "column",
    gap: "0.8rem",
  },
  "prodigi-upload-status-description": {
    padding: "1.6rem",
    backgroundColor: Grey10,
    borderRadius: "0.4rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  "prodigi-status-data-container": {
    display: "flex",
    flexDirection: "column",
    gap: "0.8rem",
    maxHeight: "40vh",
    overflowY: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "#c4c4c4 #f4f5f8",
    "&::-webkit-scrollbar": {
      width: " 1.2rem",
      height: " 1.2rem",
    },
    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#c4c4c4",
      "&:hover": {
        backgroundColor: "#97999B !important",
      },
      borderRadius: "2rem",
      border: `0.4rem solid ${MarutiWhite}`,
    },
  },
}));

export default useStyles;
