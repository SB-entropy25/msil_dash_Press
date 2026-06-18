import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Divider,
  ListSubheader,
  MenuItem,
  Select as MuiSelect,
  Typography,
} from "@mui/material";
import * as React from "react";
import { TypeSecondary } from "../../utils/colors";
import Loader from "../Loader/Loader";

const GroupedSelect = ({
  label = "",
  name = "",
  value = "",
  onChange = () => {},
  sx = { width: "fit-width" },
  handleClearAll = () => {},
  options = [],
}) => {
  const menuItems = options?.flatMap((item, index) => {
    const items = [
      <ListSubheader className="grouped-select" key={index}>
        {item?.name}
      </ListSubheader>,
    ];
    items.push(
      item?.value?.map((item, i) => (
        <MenuItem
          className="grouped-select"
          key={`${item?.id} ${i}`}
          value={item}
        >
          {item?.value}
        </MenuItem>
      ))
    );
    {
      options?.length !== index + 1 &&
        items.push(
          <Divider
            key={new Date() + index}
            sx={{ mt: "0.6rem !important", mb: "0.6rem !important" }}
          />
        );
    }
    return items;
  });
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
      displayEmpty
      onChange={(event) => onChange(event.target.value)}
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
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", gap: "0.4rem" }}>
            <Typography
              sx={{
                color: TypeSecondary,
              }}
            >
              {value?.value !== "" ? value?.value : label}
            </Typography>
          </Box>

          <CloseIcon
            sx={{
              cursor: "pointer",
              display: value?.value === "" ? "none" : "inherit",
            }}
            onMouseDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handleClearAll(name);
            }}
          />
        </Box>
      )}
    >
      {options?.length === 0 && (
        <MenuItem key={new Date() + "dsfd"} disabled value="">
          <Loader size="SMALL" />
        </MenuItem>
      )}
      {menuItems}
    </MuiSelect>
  );
};
export default GroupedSelect;
