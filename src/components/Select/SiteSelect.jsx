import { MenuItem } from "@mui/material";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Grey30, MarutiBlue500 } from "../../utils/colors";

const theme = createTheme({
  palette: {
    neutral: {
      main: MarutiBlue500,
    },
  },
});
theme.components.MuiOutlinedInput = {
  styleOverrides: {
    root: {
      borderColor: `${Grey30} !important`,

      outline: Grey30,
      "& fieldset": {
        borderColor: Grey30,
        ouline: "none",
      },

      "&.Mui-focused": {
        "&:hover fieldset": {
          borderColor: Grey30,
          ouline: "none",
        },
      },
      "&:hover": {
        "&:hover fieldset": {
          borderColor: Grey30,
          ouline: "none",
        },
      },
    },
  },
};
theme.components.MuiInputBase = {
  styleOverrides: {
    formControl: {
      height: "3.2rem !important",
    },
  },
};
theme.components.MuiSelect = {
  styleOverrides: {
    outlined: {
      fontFamily: "Roboto !important",
      fontStyle: "normal !important",
      fontWeight: "normal !important",
      fontSize: "1.4rem !important",
      lineHeight: "1.6rem !important",
      letterSpacing: "-0.025em !important",
      color: " #000000 !important",
      marginLeft: "0.5rem !important",
      position: "relative !important",
      top: "0.2rem !important",
    },
  },
};
theme.components.MuiList = {
  styleOverrides: {
    padding: {
      padding: "0.8rem !important",
    },
    root: {
      maxHeight: "16rem",
      overflowY: "auto",
      scrollbarWidth: "thin",
      scrollbarColor: "#c4c4c4 #fff",
      "&::-webkit-scrollbar": {
        width: " 1rem",
      },
      "&::-webkit-scrollbar-track": {
        background: " #ffffff",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#c4c4c4",
        "&:hover": {
          backgroundColor: "#97999B !important",
        },
        height: "3rem",
        borderRadius: "2rem",
        border: "0.4rem solid #ffffff",
      },
    },
  },
};
theme.components.MuiPaper = {
  styleOverrides: {
    elevation: {
      position: "relative !important",
      // marginTop: "-1.1rem !important",
      maxHeight: "fit-content !important",
      maxWidth: "fit-content !important",
      borderRadius: "0.8rem",
    },
  },
};
theme.components.MuiMenuItem = {
  styleOverrides: {
    gutters: {
      fontStyle: "normal !important",
      fontWeight: "normal !important",
      fontSize: "1.4rem !important",
      lineHeight: "1.6rem !important",
      letterSpacing: "-0.025em !important",
      color: "#66696b !important",
      borderBottom: "0.1rem solid #e6e9f0 !important",
    },
  },
};

const Select = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <TextField
        id={props.id}
        name={props.name}
        required={props.required}
        select
        slotProps={{
          select: {
            MenuProps: {
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
            },
          },
          input: {
            startAdornment:
              //TODO: MAKE LABEL FLEX TO SUPPORT MULTI WORD LABEL
              props.label ? (
                <span className="select-label font-regular font-normal">
                  {props.label}:
                </span>
              ) : (
                <></>
              ),
          },
        }}
        style={{ minWidth: "9.9rem" }}
        disabled={props.disabled ? props.disabled : false}
        fullWidth={true}
        value={props.value ? props.value : "none"}
        color="neutral"
        onChange={props.onChange}
      >
        {props.children ? (
          props.children
        ) : (
          <MenuItem style={{ display: "none" }} key={"none"} value={""}>
            none
          </MenuItem>
        )}
      </TextField>
    </ThemeProvider>
  );
};
export default Select;
