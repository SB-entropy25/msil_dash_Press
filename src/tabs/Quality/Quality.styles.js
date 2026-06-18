import { makeStyles } from "@mui/styles";
import {
  Grey10,
  MarutiBlack,
  MarutiBlue500,
  MarutiWhite,
  Red100,
  Red50,
  TypePrimary,
  TypeTertiary,
} from "../../utils/colors";

const useStyles = makeStyles((theme) => ({
  "prodigi-red-info": {
    height: "3.2rem",
    borderRadius: "0.4rem",
    border: `0.063rem solid ${Red100}`,
    backgroundColor: Red50,
    display: "flex",
    alignItems: "center",
    paddingLeft: "1.8rem",
    paddingRight: "1.8rem",
  },

  "filter-container-flex": {
    display: "flex",
    alignItems: "start",
    justifyContent: "space-between",
    gap: "2rem",
  },
  "quality-filters": {
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
    flexWrap: "wrap",
  },
  "quality-right-info": {
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
  },
  "container-flex": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "2rem",
  },
  "prodigi-table-body": {
    "& .MuiTableRow-root": {
      "&:last-child": {
        "& .MuiTableCell-root": { borderBottom: "0" },
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
  "prodigi-dialog-data-container": {
    marginTop: "1.2rem",
    marginBottom: "1.2rem",
    height: "40vh",
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
      border: `0.4rem solid ${MarutiWhite}`,
    },
  },
  "prodigi-table-dimensions": {
    // "@media (max-height: 599px)": {
    //   height: "48.2rem",
    // },
    // "@media (min-height: 600px) and (max-height: 900px)": {
    //   height: "60rem",
    // },

    // "@media (min-height: 901px)": {
    //   height: "73rem",
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
      border: `0.4rem solid ${MarutiWhite}`,
    },
    "container-flex": {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
  },
  "card-container-flex": {
    display: "flex",
    color: MarutiBlack,
    fontWeight: 400,
  },
  "rework-employ-details-main": {
    background: Grey10,
    padding: "1.6rem 1.6rem 1.6rem 1.6rem",
    marginBottom: "1.2rem",
  },

  "rework-employ-details": {
    display: "flex",
    alignItems: "flex-start",
    gap: "2.4rem",
    borderRadius: "0.4rem",
    color: TypeTertiary,
    letterSpacing: "-0.03rem",
  },
  "submit-id-main": {
    background: Grey10,
    // height: "9.4rem",
    marginBottom: "1.2rem",
    padding: "1.6rem ",
    borderRadius: "0.4rem",
  },
  "submit-id": {
    display: "flex",
    alignItems: "flex-start",
    gap: "2rem",

    color: TypePrimary,
    fontWeight: "400",
    fontSize: "1.4rem",
    lineHeight: "2.5rem",
  },
  "quantity-header": {
    color: MarutiBlue500,
    fontSize: "1.4rem",
    fontWeight: 600,
    lineHeight: "1rem",
    letterSpacing: "- 0.035rem",
  },
  "prodigi-quality-info": {
    padding: "0.8rem",
    borderRadius: "0.4rem",
    display: "flex",
    color: MarutiBlack,
  },
  "add-row": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    flex: "1 0 0",
    color: "#2D3394",
    fontSize: "1.4rem",
    fontWeight: 400,
  },
}));

export default useStyles;
