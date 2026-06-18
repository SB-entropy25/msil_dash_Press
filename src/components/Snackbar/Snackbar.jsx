import { Alert as Message, Snackbar } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { MarutiWhite } from "../../utils/colors";

const themeSnackbar = createTheme();
themeSnackbar.components.MuiSnackbarContent = {
  styleOverrides: {
    root: {
      fontWeight: " normal !important",
      fontSize: "1.4rem !important",
      lineHeight: "1.6rem !important",
      letterSpacing: "-0.025em !important",
    },
  },
};
themeSnackbar.components.MuiAlert = {
  styleOverrides: {
    root: {
      fontWeight: " normal !important",
      fontSize: "1.4rem !important",
      lineHeight: "1.6rem !important",
      letterSpacing: "-0.025em !important",
      display: "flex",
      alignItems: "center",
      color: MarutiWhite,
      backgroundColor: "#323232",
    },
    action: {
      padding: 0,
      marginLeft: "2rem",
    },
  },
};

const mapper = {
  ERROR: "error",
  SUCCESS: "success",
  WAITING: "info",
  ALERT: "warning",
};
const Alert = ({
  message = "",
  open = false,
  anchorOrigin = { vertical: "bottom", horizontal: "center" },
  onClose = () => {},
  type = "",
  className = "",
}) => {
  return (
    <ThemeProvider theme={themeSnackbar}>
      {open !== "" && type === "" ? (
        <Snackbar
          anchorOrigin={anchorOrigin}
          open={open}
          autoHideDuration={5000}
          onClose={onClose}
          message={message}
          className={className}
        />
      ) : (
        <Snackbar
          anchorOrigin={anchorOrigin}
          open={open}
          autoHideDuration={5000}
          onClose={onClose}
          message={message}
          className={className}
        >
          <Message
            // onClose={onClose}
            severity={mapper[type]}
            sx={{ width: "100%" }}
          >
            {message}
          </Message>
        </Snackbar>
      )}
    </ThemeProvider>
  );
};
export default Alert;
