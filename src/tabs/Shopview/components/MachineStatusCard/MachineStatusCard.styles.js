import { makeStyles } from "@mui/styles";
import { Brown, Grey30, MarutiWhite } from "../../../../utils/colors";

const useStyles = makeStyles((theme) => ({
  "critical-status": {
    background: Brown,
    color: MarutiWhite,
  },
  "barder-box-item": {
    width: "100%",
    height: "100%",
    flexShrink: 0,
    borderRadius: "0.4rem",
    border: `1px solid ${Grey30}`,
    background: MarutiWhite,
    borderCollapse: "collapse",
  },
  "box-item-progress-container": {
    borderBottom: `1px solid ${Grey30}`,
    padding: "1.2rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  "box-item-title": {
    borderBottom: `1px solid ${Grey30}`,
    padding: "1.2rem",
    display: "flex",
    alignItems: "center",
  },
  "box-item-flex": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  "machine-card-item": {
    flex: 1,
    padding: "1.2rem",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
}));
export default useStyles;
