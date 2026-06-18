import { makeStyles } from "@mui/styles";
import {
  Brown,
  Green,
  Grey6,
  Grey7,
  MarutiWhite,
  Red,
  StatusLightGrey,
  Yellow,
  Yellow2,
} from "../../../../utils/colors";

const useStyles = makeStyles((theme) => ({
  "container-flex": {
    display: "flex",
    alignItems: "center",
    gap: "1.2rem",
    justifyContent: "space-between",
    // flexWrap: "wrap",
  },
  machine: {
    color: Grey6,
    marginBottom: "0.8rem",
    paddingBottom: "0.2rem",
    borderBottom: `1px solid ${Grey7}`,
  },
  "status-container-flex": {
    display: "flex",
    alignItems: "center",
    gap: "4rem",
    // border:"1px solid red"
  },
  status: {
    display: "flex",
    alignItems: "center",
    gap: "1.2rem",
    padding: "0.8rem 1.2rem",
    borderRadius: "0.4rem",
    border: `1px solid ${StatusLightGrey}`,
    background: StatusLightGrey,
    justifyContent: "center",
  },
  "running-status": {
    background: Green,
    color: MarutiWhite,
  },
  "idle-status": {
    background: Yellow,
    color: MarutiWhite,
  },
  "breakdown-status": {
    background: Red,
    color: MarutiWhite,
  },

  "schedule-status": {
    background: Yellow2,
    color: MarutiWhite,
  },
  "critical-status": {
    background: Brown,
    color: MarutiWhite,
  },
}));
export default useStyles;
