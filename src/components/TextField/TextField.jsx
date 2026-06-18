import { TextField } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const themeSearch = createTheme({
  palette: {
    neutral: {
      main: "#171C8F",
    },
  },
});
themeSearch.components.MuiOutlinedInput = {
  styleOverrides: {
    root: {
      height: "3.2rem",
      borderColor: "#CFD2D9 !important",
      paddingLeft: "1.2rem",
      paddingRight: "0.6rem",
      outline: "#CFD2D9",
      "& fieldset": {
        borderColor: "#CFD2D9",
        ouline: "none",
      },
      "&>.MuiOutlinedInput-input": {
        paddingLeft: "0rem",
      },
      "&.Mui-focused": {
        "&:hover fieldset": {
          borderColor: "#CFD2D9",
          ouline: "none",
        },
      },
      "&:hover": {
        "&:hover fieldset": {
          borderColor: "#171C8F",
          ouline: "none",
        },
      },
    },
    input: {
      fontFamily: "Roboto !important",
      fontStyle: "normal",
      padding: "0rem",
      marginLeft: "0.2rem",
      fontWeight: "normal",
      fontSize: "1.4rem",
      borderColor: "#CFD2D9 !important",
      lineHeight: "1.6rem",
      letterSpacing: "-0.025em",
      color: "#343536",
      "&::placeholder": {
        color: "#9EA1A7 !important",
        opacity: "1 !important",
      },
    },
  },
};
const TextInput = (props) => {
  return (
    <ThemeProvider theme={themeSearch}>
      <TextField
        color="neutral"
        style={{ ...props.sx }}
        value={props.value}
        type={props.type}
        name={props.name}
        error={props.error}
        onBlur={props.onBlur}
        id={props.id}
        slotProps={{
          input: {
            min: props.min,
          },
        }}
        className="prodigi-input"
        placeholder={props.placeholder}
        onChange={props.onChange}
        disabled={props.disabled}
        accept={props.accept}
        {...props}
      />
    </ThemeProvider>
  );
};
export default TextInput;
