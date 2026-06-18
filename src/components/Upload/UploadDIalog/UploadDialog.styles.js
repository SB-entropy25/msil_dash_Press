import { makeStyles } from "@mui/styles";
import { Grey20 } from "../../../utils/colors";

const useStyles = makeStyles((theme) => ({
  "prodigi-upload-container": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    border: `1px solid ${Grey20}`,
    borderRadius: "0.4rem",
    padding: "0.8rem",
    gap: "0.8rem",
  },
}));

export default useStyles;
