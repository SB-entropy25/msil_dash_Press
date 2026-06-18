import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  "container-flex": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  "container-flex-start": {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
}));

export default useStyles;
