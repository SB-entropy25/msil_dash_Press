
  import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  "downtime-filters": {
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
    flexWrap: "wrap",
  },
  "container-flex": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.8rem",
  },
  "container-flex-start": {
    display: "flex",
    alignItems: "start",
    justifyContent: "space-between",
    gap: "0.8rem",
  },
}));

export default useStyles;
