import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  "dialog-title-container": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  "dialog-header-buttons": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
  },
}));

export default useStyles;
