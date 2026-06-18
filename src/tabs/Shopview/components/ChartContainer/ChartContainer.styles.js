import { makeStyles } from "@mui/styles";
import { Grey30, TypeSecondary } from "../../../../utils/colors";

const useStyles = makeStyles((theme) => ({
  "box-item-head": {
    borderBottom: `1px solid ${Grey30}`,
    padding: "1.2rem",
  },
  "box-item-flex": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  "chart-qnty": {
    position: "relative",
    color: TypeSecondary,
  },
  "actual-plan": {
    width: "15px",
    height: "3px",
    flexShrink: 0,
    marginRight: "5px",
  },
}));
export default useStyles;
