import { makeStyles } from "@mui/styles";
import { Grey30 } from "../../utils/colors";

const useStyles = makeStyles((theme) => ({
  "custom-prodigi-textfield": {
    width: "100%",
    height: "2.6rem",
    border: `1px solid ${Grey30}`,
    borderRadius: "0.4rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0",
    paddingLeft: "0",
    paddingRight: "0",
  },
  "image-link": {
    cursor: "pointer",
  },
  "custom-prodigi-select": {
    width: "2.6rem",
    height: "2.6rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

export default useStyles;
