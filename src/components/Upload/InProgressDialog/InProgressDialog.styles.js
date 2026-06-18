import { makeStyles } from "@mui/styles";
import { Grey10, Grey20 } from "../../../utils/colors";

const useStyles = makeStyles((theme) => ({
  "download-modal-container": {
    display: "flex",
    flex: 5,
    alignItems: "center",
    gap: "1rem",
    padding: "1rem",
    border: "1px solid #e6e9f0",
    borderRadius: "4px",
  },
  "download-modal-progress": {
    flex: 4,
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1rem",
    height: "3.2rem",
    borderRadius: "0.4rem",
    backgroundColor: Grey10,
  },
  "plan-modal": {
    border: `1px solid ${Grey20}`,
    borderRadius: "0.4rem",
    padding: "0.8rem",
  },
}));

export default useStyles;
