import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  "container-flex": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  "image-link": {
    cursor: "pointer",
  },
  "alerts-items-container": {
    maxHeight: "50vh",
    overflowX: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "#c4c4c4 #f4f5f8",
    "&::-webkit-scrollbar": {
      width: " 1.2rem",
    },
    "&::-webkit-scrollbar-track": {
      background: " #ffffff",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#c4c4c4",
      "&:hover": {
        backgroundColor: "#97999B !important",
      },
      height: "3rem",
      borderRadius: "2rem",
      border: "0.4rem solid #ffffff",
    },
  },
}));

export default useStyles;
