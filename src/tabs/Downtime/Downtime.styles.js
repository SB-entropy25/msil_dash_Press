import { makeStyles } from "@mui/styles";
import { Red100, Red50 } from "../../utils/colors";

const useStyles = makeStyles((theme) => ({
  "prodigi-red-info": {
    height: "3.2rem",
    borderRadius: "0.4rem",
    border: `1px solid ${Red100}`,
    backgroundColor: Red50,
    display: "flex",
    alignItems: "center",
    paddingLeft: "1.8rem",
    paddingRight: "1.8rem",
  },
  "downtime-sections": {
    display: "flex",
    flexDirection: "column",
    gap: "1.7rem",
  },
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
  "prodigi-table-body": {
    "& .MuiTableRow-root": {
      "&:last-child": {
        "& .MuiTableCell-root": { borderBottom: "0px" },
      },
    },
  },
  "loader-container": {
    width: "100%",
    marginTop: "1rem",
    marginBottom: "1rem",
    justifyContent: "center",
    display: "flex",
  },
  "prodigi-table-dimensions": {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    flex: 1,
  },
  "prodigi-table": {
    flex: 1,
    overflowY: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "#c4c4c4 #fff",
    "&::-webkit-scrollbar": {
      width: " 1.2rem",
      height: " 1.2rem",
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
      border: "0.4rem solid #ffffff",
    },
  },
}));

export default useStyles;
