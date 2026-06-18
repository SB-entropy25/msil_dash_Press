import { makeStyles } from "@mui/styles";
import { Brown, MarutiWhite } from "../../../../utils/colors";

const useStyles = makeStyles((theme) => ({
  "prodigi-table-dimensions": {
    flex: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  "prodigi-table": {
    flex: 1,
    overflowY: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "#c4c4c4 #fff",
    border: "none",
    "&::-webkit-scrollbar": {
      width: " 1rem",
      height: " 1rem",
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
    "container-flex": {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
  },

  "progress-barder-critical": {
    position: "absolute",
    width: "1.6rem",
    height: "1.6rem",
    border: `0.4rem solid ${Brown}`,
    backgroundColor: MarutiWhite,
    borderRadius: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  },
}));
export default useStyles;
