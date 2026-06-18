import backgroundImage from "../../assets/Images/iot_background.png";
import { fontLarge } from "../../utils/commonStyles";

export const landingStyles = {
  landingRoot: {
    flex: 1,
    backgroundImage: `url(${backgroundImage})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    position: "relative",
    zIndex: 2000,
  },
  landingMsLogo: {
    height: "3.4rem",
    width: "31.6rem",
    position: "absolute",
    top: "6.8rem",
    left: "9.3rem",
  },
  landingBoxContainer: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  landingBox: {
    width: "75.4rem",
    height: "36.8rem",
    background: "#171C8F",
    opacity: 0.9,
    borderRadius: "3.8rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  landingBoxLogo: {
    marginTop: "6rem",
    marginBottom: "4.5rem",
    display: "flex",
    justifyContent: "center",
  },
  landingBoxButton: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "4.5rem",
  },
  landingButton: {
    padding: "1.3rem 2.4rem !important",
    textAlign: "center",
    color: "#FFFFFF !important",
    textTransform: "capitalize !important",
    backgroundImage: "linear-gradient(#5255ac, #171C8F)",
    ...fontLarge,
  },
};
