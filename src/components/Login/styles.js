import { MarutiBlue500, TypePrimary, TypeSecondary } from "../../utils/colors";

export const vendorStyles = {
  main: {
    flex: 1,
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    position: "relative",
    zIndex: 2000,
  },
  "login-wrapper": {
    flex: 1,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  msillogo: {
    height: "3.4rem",
    width: "31.6rem",
    position: "absolute",
    top: "6rem",
    left: "9rem",
  },
  "login-container": {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "5rem",
  },
  "login-card": {
    position: "relative",
    padding: "4rem 6rem",
    width: "33%",

    display: "flex",
    flexDirection: "column",
    gap: "4rem",

    background: "white",
    borderRadius: "1rem",
    boxShadow: "0px 6.4px 14.4px 0px #00000021",
    boxShadow: "0px 1.2px 3.6px 0px #0000001A",
  },
  iotlogo: {
    height: "6rem",
    width: "auto",
    marginBottom: "2rem",
  },
  inputLabel: {
    fontFamily: "Roboto",
    fontWeight: "600  !important",
    fontSize: "1.6rem !important",
    lineHeight: "2.5rem  !important",
    letterSpacing: "-2.5% !important",
    color: TypeSecondary,
  },
  input: {
    marginTop: "0.5rem !important",
    height: "5rem !important",
    fontSize: "1.4rem !important",
  },
  info: {
    fontFamily: "Roboto",
    fontWeight: "400  !important",
    fontSize: "1.375rem !important",
    lineHeight: "1.65rem  !important",
    letterSpacing: "-2.5% !important",
    color: TypePrimary,
  },
  anchor: {
    color: MarutiBlue500,
    cursor: "pointer",
    fontSize: "1.4rem !important",
  },
  pointer: {
    cursor: "pointer",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    gap: "2.25rem",
  },
  otpInput: {
    justifyContent: "space-between",
  },
};
