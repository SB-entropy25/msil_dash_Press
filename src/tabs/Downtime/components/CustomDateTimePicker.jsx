import { Close } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { IconButton, InputAdornment, Typography } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import moment from "moment";
import { useState } from "react";

const CustomDateTimePicker = ({
  label = "Date",
  disabled = false,
  value,
  onChange = () => {},
  ...props
}) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = () => {
    setOpen(true);
  };

  const handleCloseChange = () => {
    setOpen(false);
  };

  const formatDateTime = (val, type = "DD MM YYYY; h:mm A") => {
    if (val === "-") {
      return "-";
    }
    if (val) {
      return moment(val).format(type);
    }
  };
  const formatValue = (value) => {
    return formatDateTime(value, "DD/MM/YYYY | hh:mm A");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        viewRenderers={{
          hours: renderTimeViewClock,
          minutes: renderTimeViewClock,
        }}
        open={open}
        onOpen={handleOpenChange}
        onClose={handleCloseChange}
        disabled={disabled}
        format="dd/MM/yyyy | hh:mm aa"
        ampm={true}
        disableRipple={true}
        value={value}
        onChange={(newValue) => {
          onChange(newValue);
        }}
        slots={{
          openPickerIcon: !open ? ArrowDropDownIcon : ArrowDropUpIcon,
        }}
        slotProps={{
          textField: {
            error: false,
            inputProps: {
              value: formatValue(value),
              placeholder: "dd/mm/yyyy | hh:mm (a|p)m",
            },
            sx: {
              minWidth: "fit-content",
              "& .MuiIconButton-root": {
                "&:hover": {
                  backgroundColor: "transparent",
                },
                "& .MuiTouchRipple-root": {
                  display: "none",
                },
              },
              "& .MuiInputBase-root": {
                paddingLeft: "1rem",
                paddingRight: "1.6rem",
                "&.Mui-focused": {
                  "& .MuiIconButton-root": {
                    background: "transparent",
                  },
                },
              },
              "& .MuiInputBase-input": {
                padding: "0 0.6rem 0.2rem 0.6rem",
                ".reports-paper &": {
                  padding: "0 0.6rem 0rem 0.6rem",
                },
                // Ensure the placeholder is visible if value is empty
                visibility: value === "" ? "visible" : "visible",
                width: "17rem",
                textIndent: "0 !important",
              },
              "& .MuiInputAdornment-root": {
                marginLeft: "2px",
              },
            },
            disabled,
            InputProps: {
              startAdornment: (
                <Typography
                  sx={{
                    whiteSpace: "nowrap",
                    mr: 0,
                    color: "text.secondary",
                  }}
                >
                  {label && `${label}${value !== "" ? ":" : ""}`}
                </Typography>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange("");
                    }}
                    sx={{
                      padding: "0",
                      mr: "3px",
                      // visibility: value ? "visible" : "hidden",
                      opacity: value ? 1 : 0,
                      pointerEvents: !value ? "none" : "auto",
                    }}
                  >
                    <Close />
                  </IconButton>

                  <IconButton
                    onClick={handleOpenChange}
                    sx={{ padding: "0", ml: "3px" }}
                  >
                    {!open ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};
export default CustomDateTimePicker;
