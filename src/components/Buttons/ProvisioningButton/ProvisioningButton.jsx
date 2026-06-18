import { Button } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { MarutiBlue500 } from "../../colors";
import "./ProvisioningButton.css";

const theme = createTheme({
    palette: {
      neutral: {
        main: MarutiBlue500,
        contrastText: '#fff',
      },
    },
  });
const ProvisioningButton=(props)=>{
    return (
        <ThemeProvider theme={theme}>
            <Button onClick={props.onClick} className="provisioning-button-root" color="neutral" variant="outlined" disabled={props.disabled?props.disabled:false}>
                {props.children}
            </Button>
        </ThemeProvider>
    )
};
export default ProvisioningButton;