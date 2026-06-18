import { Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { MarutiBlue500 } from "../../../utils/colors";
import "./TransparentButton.css";

const theme = createTheme({
  palette: {
    neutral: {
      main: MarutiBlue500,
      contrastText: "#fff",
    },
  },
});
const TransparentButton = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <Button
        type={props.type}
        className="transparent-button-root"
        onClick={props.onClick}
        color="neutral"
        variant="outlined"
        disabled={props.disabled ? props.disabled : false}
      >
        {props.children}
      </Button>
    </ThemeProvider>
  );
};
export default TransparentButton;
