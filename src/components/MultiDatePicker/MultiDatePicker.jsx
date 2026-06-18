import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CloseIcon from "@mui/icons-material/Close";
import { Avatar, Box, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import { MarutiBlue500, TypeSecondary } from "../../utils/colors";
import "./MultiDatePicker.css";

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

const MultiDatePicker = ({
  label = "Production Date",
  selectedCount = 0,
  value = [],
  onChange = () => {},
  handleClearAll = () => {},
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleCalendarOpen = () => {
    setIsCalendarOpen(true);
  };

  const handleCalendarClose = () => {
    setIsCalendarOpen(false);
  };
  return (
    <DatePicker
      onOpen={handleCalendarOpen}
      onClose={handleCalendarClose}
      isOpen={isCalendarOpen}
      className="custom-calendar"
      value={value}
      onChange={onChange}
      multiple
      weekDays={weekDays}
      format="DD/MM/YYYY"
      plugins={[<DatePanel sort="date" />]}
      offsetY={-10}
      highlightToday={false}
      render={
        <CustomInput
          open={isCalendarOpen}
          label={label}
          selectedCount={selectedCount}
          handleClearAll={handleClearAll}
        />
      }
    />
  );
};
export default MultiDatePicker;
const CustomInput = ({
  onFocus,
  value,
  onChange,
  label,
  selectedCount,
  handleClearAll,
  open = false,
}) => {
  return (
    <TextField
      onClick={onFocus}
      value={value}
      onChange={onChange}
      className="prodigi-datetime"
      sx={{
        "& .MuiInputBase-input": {
          display: "none",
        },
        "& .MuiInputBase-root": {
          paddingLeft: "1rem",
          paddingRight: "1rem",
        },
      }}
      InputProps={{
        startAdornment: (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Typography sx={{ color: TypeSecondary }}>{label}</Typography>
              <Avatar
                sx={{
                  bgcolor: MarutiBlue500,
                  width: 18,
                  height: 18,
                  display: selectedCount === 0 ? "none" : "inherit",
                }}
              >
                {selectedCount}
              </Avatar>
            </Box>
          </Box>
        ),
        endAdornment: (
          <Box
            sx={{
              marginLeft: "0.4rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <CloseIcon
              sx={{
                cursor: "pointer",
                display: selectedCount === 0 ? "none" : "inherit",
              }}
              onMouseDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleClearAll(event);
              }}
            />

            {open ? (
              <ArrowDropUpIcon
                sx={{ cursor: "pointer", color: TypeSecondary }}
              />
            ) : (
              <ArrowDropDownIcon
                sx={{ cursor: "pointer", color: TypeSecondary }}
              />
            )}
          </Box>
        ),
      }}
      color="Blue"
    />
  );
};
