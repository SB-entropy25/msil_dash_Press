import { MarutiBlue500, MarutiWhite } from "../../utils/colors";

export const appbarStyles = {
  header: {
    display: "flex",
    alignItems: "center",
  },
  "profile-container": {
    backgroundColor: "#f4f5f8",
    display: "flex",
    alignItems: "center",
    paddingLeft: "1.6rem",
    paddingRight: "1.6rem",
    height: "3rem",
    borderRadius: "2rem",
    color: "#66696b",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: "1.2rem",
    lineHeight: "1.4rem",
    letterSpacing: "-0.025em",
    cursor: "pointer",
  },
  msilAppbar: {
    width: "100%",
    height: "5.4rem !important",
    backgroundColor: `${MarutiWhite} !important`,
    color: `${MarutiBlue500} !important`,
    fontFamily: "Roboto !important",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1000,
    boxShadow: "0px 1.6px 3.6px 0px #00000021",
    padding: "0.5rem 1.75rem",
  },
};
