import { Box, TextField } from "@mui/material";
import React from "react";
import SearchIcon from "../../assets/icons/search.svg";

const Searchbox = ({
  name = "",
  value,
  placeholder = "",
  onChange = () => {},
  sx = { width: "30rem" },
}) => {
  return (
    <TextField
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      className="prodigi-input"
      sx={sx}
      slotProps={{
        input: {
          endAdornment: (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginLeft: "0.6rem",
                marginRight: "0.6rem",
              }}
            >
              <img
                alt=""
                src={SearchIcon}
                style={{
                  cursor: "pointer",
                  height: "1.6rem",
                  width: "1.6rem",
                }}
              />
            </Box>
          ),
        },
      }}
      color="Blue"
    />
  );
};
export default Searchbox;
