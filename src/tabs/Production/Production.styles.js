import { makeStyles } from "@mui/styles";
import { Grey30, Red100, Red50, StatusLightGrey } from "../../utils/colors";

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
  "material-fields": {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
  },
  "container-flex": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.8rem",
  },
  "container-flex-h-start": {
    display: "flex",
    alignItems: "start",
    justifyContent: "space-between",
    gap: "0.8rem",
  },
  "container-flex-start": {
    display: "flex",
    alignItems: "center",
    justifyContent: "start",
    gap: "0.8rem",
  },
  "container-flex-column": {
    display: "flex",
    justifyContent: "start",
    flexDirection: "column",
  },
  "prodigi-info-primary": {
    height: "3.2rem",
    borderRadius: "0.4rem",
    backgroundColor: StatusLightGrey,
    display: "flex",
    alignItems: "center",
    paddingLeft: "0.8rem",
    paddingRight: "0.8rem",
    width: "fit-content",
    whiteSpace: "nowrap",
  },
  "prodigi-info-secondary": {
    height: "3.2rem",
    borderRadius: "0.4rem",
    border: `1px solid ${Grey30}`,
    display: "flex",
    alignItems: "center",
    paddingLeft: "1.2rem",
    paddingRight: "1.2rem",
    justifyContent: "space-between",
    width: "16rem",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  "dashboard-card": {
    padding: "1.6rem",
    // boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.06)",
    borderRadius: "0.8rem",
    border: "none",
    border: `1px solid ${Grey30}`,
  },
  "production-card": {
    border: "1px solid #68DE82",
    borderRadius: "0.4rem",
    padding: "1.6rem",
    marginBottom: "2rem",
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
  "prodigi-prod-table-dimensions": {
    // "@media (max-height: 599px)": {
    //   height: "27rem",
    // },
    // "@media (min-height: 600px) and (max-height: 900px)": {
    //   height: "37rem",
    // },

    // "@media (min-height: 901px)": {
    //   height: "50rem",
    // },
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    flex: 1,
  },
  "prodigi-prod-table": {
    flex: 1,
    overflowY: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "#c4c4c4 #f4f5f8",
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

  "prodigi-dialog-table-dimensions": {
    height: "38vh",
    "@media(min-width: 1366px)": {
      height: "35vh",
    },
    "@media(min-width: 1920px)": {
      height: "42vh",
    },
    "@media(min-width: 2560px)": {
      height: "46vh",
    },
    marginBottom: "1.6rem",
  },
  "prodigi-dialog-table": {
    height: "100%",
    overflowY: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "#c4c4c4 #f4f5f8",
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
  "dashboard-card-no-part": {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
}));

export default useStyles;
