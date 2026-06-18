import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClearIcon from "@mui/icons-material/Clear";
import { Box, Divider, IconButton, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import {
  Grey30,
  MarutiBlack,
  MarutiBlue500,
  TypeSecondary,
} from "../../utils/colors";
import CustomCheckbox from "../Checkbox/CustomCheckbox";

const scrollStyle = {
  scrollbarWidth: "thin",
  scrollbarColor: "#c4c4c4 #F4F5F8",
  "&::-webkit-scrollbar": {
    width: "0.5rem",
    height: "0.5rem",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#c4c4c4",
    "&:hover": {
      backgroundColor: "#97999B !important",
    },
    borderRadius: "2rem",
    border: "0.4rem solid #ffffff",
  },
};

const MultiSelectFilter = ({
  label,
  options,
  onChange,
  selectLabel,
  disabled,
  values,
}) => {
  const [selectedValues, setSelectedValues] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (Array.isArray(values)) {
      setSelectedValues(values);
    }
  }, [values]);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleClear = () => {
    setSelectedValues([]);
    onChange([]);
  };

  const handleCheckboxChange = (option) => {
    if (disabled) return;

    let newValues;

    if (option === "All") {
      if (selectedValues?.length === options?.length) {
        newValues = [];
      } else {
        newValues = options;
      }
    } else {
      newValues = selectedValues.includes(option)
        ? selectedValues?.filter((value) => value !== option)
        : [...selectedValues, option];
    }

    setSelectedValues(newValues);
    if (onChange) {
      onChange(newValues);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const allSelected = selectedValues?.length === options?.length;

  const filteredOptions = options?.filter((option) =>
    option
      ?.toLowerCase()
      ?.toString()
      .includes(searchTerm?.toLowerCase()?.toString())
  );

  const displayText = () => {
    if (allSelected)
      return (
        <Typography
          variant="body1"
          sx={{ color: disabled ? "#B8BABD" : MarutiBlack }}
        >
          All
        </Typography>
      );
    if (selectedValues.length === 1)
      return (
        <Typography variant="body1" noWrap>
          {selectedValues[0]}
        </Typography>
      );

    if (selectedValues.length > 1)
      return (
        <Box
          sx={{
            backgroundColor: MarutiBlue500,
            color: "#FFFFFF",
            borderRadius: "50%",
            width: selectedValues.length > 99 ? "25px" : "16px",
            height: "14px",
            fontSize: "1.2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {selectedValues.length > 99 ? "99+" : selectedValues?.length}
        </Box>
      );
    return <Typography variant="body1">Select</Typography>;
  };

  return (
    <Box
      ref={dropdownRef}
      sx={{
        position: "relative",
        display: "inline-block",
        minWidth: "17rem",
        maxWidth: "17rem",
      }}
    >
      <Box
        sx={{
          cursor: "pointer",
          pointerEvents: disabled ? "none" : "auto",
          padding: "6px",
          border: `1px solid #ccc`,
          borderRadius: "4px",
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          "&:hover": {
            border: "1px solid",
            borderColor: MarutiBlue500,
          },
        }}
        onClick={toggleDropdown}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "85%",
          }}
        >
          <Typography variant="body1" noWrap color={TypeSecondary}>
            {label}:
          </Typography>
          <Box
            sx={{
              paddingLeft: "0.4rem",
              width: selectedValues?.length > 1 || allSelected ? "10%" : "50%",
            }}
          >
            {displayText()}
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {selectedValues.length > 0 && (
            <IconButton onClick={handleClear} sx={{ padding: "0rem" }}>
              <ClearIcon sx={{ fontSize: "10px", color: "#B8BABD" }} />
            </IconButton>
          )}
          <ArrowDropDownIcon sx={{ color: disabled ? "#B8BABD" : "inherit" }} />
        </Box>
      </Box>
      {isOpen && !disabled && (
        <Box
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "0px 0px 4px 4px",
            borderTop: "transparent",
            backgroundColor: "#ffffff",
            zIndex: "1000",
            maxHeight: "200px",
            overflowY: "auto",
            padding: "6px",
            ...scrollStyle,
          }}
        >
          <TextField
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "20px",
                "& .MuiInputBase-input": {
                  fontFamily: "Roboto",
                  height: "20px",
                  padding: "0px 0px",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: Grey30,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: MarutiBlue500,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: MarutiBlue500,
                },
              },
            }}
          />

          {searchTerm === "" && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "6px",
                paddingBottom: "4px",
                cursor: "pointer",
              }}
              component="label"
            >
              <CustomCheckbox
                center={true}
                checked={selectedValues?.length === options?.length}
                handleChange={() => handleCheckboxChange("ALL")}
              />
              <Typography sx={{ marginLeft: "0.4rem", color: TypeSecondary }}>
                {selectLabel}
              </Typography>
            </Box>
          )}
          <Divider />
          {filteredOptions?.map((option, index) => (
            <React.Fragment key={index}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "6px",
                  cursor: "pointer",
                }}
                component="label"
              >
                <CustomCheckbox
                  center={true}
                  checked={selectedValues.includes(option)}
                  handleChange={() => handleCheckboxChange(option)}
                />
                <Typography sx={{ marginLeft: "0.4rem", color: TypeSecondary }}>
                  {option}
                </Typography>
              </Box>
              {index !== filteredOptions?.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default MultiSelectFilter;
