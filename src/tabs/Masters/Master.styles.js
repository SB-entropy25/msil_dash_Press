import { makeStyles } from "@mui/styles";
import { Grey10 } from "../../utils/colors";

const useStyles = makeStyles((theme) => ({
  "prodigi-file-container": {
    borderRadius: "0.4rem",
    height: "3.2rem",
    display: "flex",
    width: "100%",
    alignItems: "center",
    border: `1px solid #cfd2d9`,
    paddingLeft: "1.2rem",
    color: "#9ea1a7",
  },
  "container-flex": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  "loader-container": {
    width: "100%",
    marginTop: "1rem",
    justifyContent: "center",
    display: "flex",
  },
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
  "prodigi-table-dimensions": {
    // "@media (max-height: 599px)": {
    //   height: "56rem",
    //   maxHeight: "56rem",
    // },
    // "@media (min-height: 600px) and (max-height: 900px)": {
    //   height: "67rem",
    //   maxHeight: "67rem",
    // },

    // "@media (min-height: 901px)": {
    //   height: "80rem",
    //   maxHeight: "80rem",
    // },
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
  "prodigi-table-body": {
    "& .MuiTableRow-root": {
      "&:last-child": {
        "& .MuiTableCell-root": { borderBottom: "0px" },
      },
    },
  },
}));

export default useStyles;
