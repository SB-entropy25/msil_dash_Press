import MuiIconButton from "@mui/material/Button";
import { Grey30, MarutiBlue500, MarutiWhite, TypePrimary } from "../colors";

const IconButton = ({
  type = "button",
  onClick = () => {},
  variant = "contained",
  disabled = false,
  children,
  color = "Gray",
  sx = {},
  icon = null,
  mode = "Light",
}) => {
  return (
    <MuiIconButton
      type={type}
      onClick={onClick}
      color={color}
      variant={variant}
      disabled={disabled}
      endIcon={
        icon !== null ? (
          <img
            alt=""
            src={icon}
            style={{ height: "1.6rem", width: "1.6rem" }}
          />
        ) : null
      }
      sx={{
        padding: "0.8rem 2.4rem",
        cursor: "pointer",
        height: "3.2rem",
        borderRadius: "0.4rem",
        textTransform: "capitalize",
        fontWeight: "normal",
        fontSize: "1.4rem",
        lineHeight: "1.6rem",
        textAlign: "center",
        letterSpacing: "-0.025em",
        ...sx,
        color: color === "Gray" ? TypePrimary : MarutiWhite,
        fontWeight: "bold",
        borderColor: mode === "Dark" ? MarutiBlue500 : Grey30,
        backgroundColor: mode === "Dark" ? MarutiBlue500 : "inherit",
        "&:hover": {
          fontWeight: "bold",
          borderColor: mode === "Dark" ? MarutiBlue500 : Grey30,
          backgroundColor: mode === "Dark" ? MarutiBlue500 : "inherit",
        },
      }}
    >
      {children}
    </MuiIconButton>
  );
};
export default IconButton;
