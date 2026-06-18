import { Typography } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import moment from "moment/moment";
import { useState } from "react";
import calendar from "../../assets/icons/calendar.svg";
import { TypeSecondary } from "../../utils/colors";

const MuiDateTimePicker = ({
  label = "Date",
  disabled = false,
  value,
  onChange = () => {},
  minDate = null,
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

  const Calendar = () => {
    return <img src={calendar} />;
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
        minDateTime={minDate}
        slots={{ openPickerIcon: Calendar }}
        ampm
        value={value}
        // onChange={onChange}
        onAccept={onChange}
        slotProps={{
          textField: {
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
                visibility: value === "" ? "hidden" : "visible",
                width: value === "" ? "1.2rem" : "inherit",
                textIndent: "0 !important",
              },
              // "&"
            },
            color: "primary",
            disabled,
            inputProps: {
              value: formatValue(value),
            },
            InputProps: {
              startAdornment: (
                <Typography sx={{ color: TypeSecondary, whiteSpace: "nowrap" }}>
                  {label && `${label}${value !== "" ? ":" : ""}`}
                </Typography>
              ),
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default MuiDateTimePicker;
