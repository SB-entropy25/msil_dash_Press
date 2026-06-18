import { Box, MenuItem, Select as MuiSelect, Typography } from "@mui/material";
import * as React from "react";
import { TypePrimary, TypeSecondary } from "../../utils/colors";
import { statusColor } from "../../utils/mapper";

const Select = ({
  label = "",
  name = "",
  value = "",
  onChange = () => {},
  sx = { width: "fit-width" },
  children,
  disabled,
  error = false,
  isAll = true,
  type = "SIMPLE",
}) => {
  return (
    <MuiSelect
      name={name}
      color="Blue"
      defaultValue=""
      sx={{
        ...sx,
        "& .MuiSelect-outlined": {
          display: "flex",
          alignItems: "center",
        },
      }}
      value={value}
      disabled={disabled}
      error={error}
      displayEmpty
      onChange={(event) => onChange(event)}
      MenuProps={{
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "left",
        },
        transformOrigin: {
          horizontal: "left",
        },
      }}
      renderValue={(value) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            height: "100%",
          }}
        >
          {type === "SIMPLE" && (
            <Box sx={{ display: "flex", gap: "0.4rem" }}>
              <Typography
                sx={{
                  color: TypeSecondary,
                }}
              >
                {label}:
              </Typography>
              {value && value !== "" && (
                <Typography
                  sx={{
                    color: statusColor[value]
                      ? statusColor[value]
                      : TypePrimary,
                    fontWeight: 500,
                  }}
                >
                  {value}
                </Typography>
              )}
            </Box>
          )}
          {type === "INVERTED" && (
            <Box sx={{ display: "flex", gap: "0.4rem" }}>
              <Typography
                sx={{
                  color: TypeSecondary,
                }}
              >
                {value === "" ? label : value}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    >
      {isAll && <MenuItem value="All">All</MenuItem>}
      {children}
    </MuiSelect>
  );
};
export default Select;
