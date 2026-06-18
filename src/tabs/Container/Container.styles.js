import { makeStyles } from "@mui/styles";
import { Grey10, MarutiBlue500 } from "../../utils/colors";

const useStyles = makeStyles((theme) => ({
  "shop-not-allowed": {
    flex: 1,
    display: "grid",
    gridTemplateRows: "32px 1fr",
    gridTemplateColumns: "1fr",
    gridGap: "1.6rem",
    marginBottom: "2rem",
  },
  "outer-container": {
    padding: "7rem 7rem 2rem 7rem",
    maxHeight: "100vh !important",
    minHeight: "100%",
    minWidth: "90vw",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    flex: 1,
  },
  "grid-cell": {
    height: "30px",
    border: "1px solid red",
  },
  "container-flex": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  "flex-column": {
    display: "flex",
    flexDirection: "column",
  },
  "image-link": {
    cursor: "pointer",
  },
  link: {
    cursor: "pointer",
    color: MarutiBlue500,
    textDecoration: "underline",
    fontWeight: 700,
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
}));

export default useStyles;
