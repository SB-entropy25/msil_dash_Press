import { Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { MarutiBlue500, StatusGreen, StatusRed } from "../../../utils/colors";
import "./SecondaryButton.css";

const theme = createTheme({
  palette: {
    neutral: {
      main: MarutiBlue500,
      contrastText: "#fff",
    },
    Blue: {
      main: MarutiBlue500,
      contrastText: "#fff",
    },
  },
});
const colorMapper = {
  neutral: MarutiBlue500,
  Green: StatusGreen,
  Red: StatusRed,
  Blue: MarutiBlue500,
};
const SecondaryButton = ({ sx = {}, color = "neutral", ...props }) => {
  return (
    <ThemeProvider theme={theme}>
      <Button
        sx={{
          ...sx,
          "&.Mui-disabled": {
            color: colorMapper[color],
            borderColor: colorMapper[color],
            opacity: 0.2,
          },
        }}
        onClick={props.onClick}
        className="secondary-button-root"
        color="neutral"
        variant="outlined"
        disabled={props.disabled ? props.disabled : false}
      >
        {props.children}
      </Button>
    </ThemeProvider>
  );
};
export default SecondaryButton;
