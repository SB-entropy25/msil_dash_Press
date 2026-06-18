import { Button } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "./TertiaryButton.css";
import { MarutiBlue500 } from "../../../utils/colors";

const theme = createTheme({
    palette: {
      neutral: {
        main: MarutiBlue500,
      },
    },
  });
const TertiaryButton=(props)=>{
    return (
        <ThemeProvider theme={theme}>
            <Button onClick={props.onClick} className="tertiary-button-root" color="neutral" variant="text" disabled={props.disabled?props.disabled:false}>
                {props.children}
            </Button>
        </ThemeProvider>
    )
};
export default TertiaryButton;