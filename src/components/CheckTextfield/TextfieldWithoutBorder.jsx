import OutlinedInput from "@mui/material/OutlinedInput";
import createTheme from "@mui/material/styles/createTheme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import React, { forwardRef, useRef } from "react";
import { Grey50, MarutiWhite, TypeSecondary } from "../../utils/colors";
import { sliceString } from "../../utils/helperFunctions.utils";

const theme = createTheme({
  palette: {
    White: {
      main: MarutiWhite,
    },
  },
});
theme.components.MuiOutlinedInput = {
  styleOverrides: {
    root: {
      paddingLeft: "1.2rem",
      paddingRight: "0.6rem",
      fontFamily: "Roboto !important",
      fontStyle: "normal !important",
      fontWeight: "normal !important",
      fontSize: "1.4rem !important",
      lineHeight: "1.6rem !important",
      letterSpacing: "-0.025em !important",
      color: TypeSecondary,
      borderRadius: 0,
      outline: "none",
      "&>.MuiOutlinedInput-input": {
        paddingLeft: "0rem",
      },
    },
    input: {
      width: "100%",
      paddingLeft: 0,
      paddingRight: "0.6rem",
      "&::placeholder": {
        color: Grey50,
        fontWeight: 700,
        opacity: 1,
      },
      "&.Mui-disabled": {
        WebkitTextFillColor: TypeSecondary,
      },
    },
  },
};
const TextFieldWithoutBorder = forwardRef(
  (
    {
      onKeyPress = () => {},
      onChange = () => {},
      value,
      onBlur = () => {},
      disabled = false,
      name,
      id,
      placeholder = "",
      required = false,
      done = false,
      sx = {},
    },
    ref
  ) => {
    const textInput = useRef(null);

    const focusTextInput = () => {
      if (textInput.current) {
        setTimeout(() => {
          textInput.current.querySelector("input").focus();
        }, 500);
      }
    };

    React.useImperativeHandle(ref, () => ({
      focusTextInput,
    }));

    return (
      <ThemeProvider theme={theme}>
        <OutlinedInput
          ref={textInput}
          color="White"
          onChange={onChange}
          name={name}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          value={done ? sliceString(value, 23) : value}
          disabled={disabled}
          id={id}
          sx={{ "& fieldset": { border: "none" }, ...sx }}
          onKeyDown={onKeyPress}
        />
      </ThemeProvider>
    );
  }
);
export default TextFieldWithoutBorder;
