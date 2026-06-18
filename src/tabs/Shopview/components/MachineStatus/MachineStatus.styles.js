import { makeStyles } from "@mui/styles";
import { TypeSecondary } from "../../../../utils/colors";

const useStyles = makeStyles((theme) => ({
  "shopView-status": {
    display: "flex",
    justifyContent: "space-between",
    gap: "1.4rem",
    // border:"1px solid red",
    overflow: "hidden",
  },
  "container-status-flex": {
    display: "flex",
    alignItems: "center",
    gap: "1.2rem",
    flexWrap: "wrap",
    marginLeft: "1.2rem",
    marginBottom: "1.5rem",
  },
  "shopView-running-status": {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    color: TypeSecondary,
  },
  "shop-view-cards": {
    // border: "1px solid red",
    height: "100%",
    // "@media (max-height: 599px)": {
    //   height: "45.8rem",
    // },
    // "@media (min-height: 600px) and (max-height: 900px)": {
    //   height: "58rem",
    // },

    // "@media (min-height: 901px)": {
    //   height: "70.5rem",
    // },
  },
  "machine-status": {
    color: TypeSecondary,
    margin: "1.3rem",
  },
  "status-icon": {
    width: "1rem",
    height: "0.5667rem",
    borderRadius: "4rem",
  },
}));
export default useStyles;
