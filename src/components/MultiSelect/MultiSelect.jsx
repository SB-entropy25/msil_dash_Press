import CloseIcon from "@mui/icons-material/Close";
import {
  Avatar,
  Box,
  Checkbox,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React from "react";
import { MarutiBlue500, TypeSecondary } from "../../utils/colors";

const MultiSelect = ({
  handleToggle = () => {},
  handleClearAll = () => {},
  label,
  selectedOptions = [],
  options,
  name,
  disabled = false,
}) => {
  const menuItems = options?.flatMap((item, index) => {
    const items = [
      <MenuItem
        className="prodigi-multiselect-group"
        key={index}
        value={item}
        onClick={handleToggle(item)}
        selected={selectedOptions?.includes(item)}
      >
        <ListItemIcon>
          <Checkbox
            size="large"
            color="Blue"
            disableRipple
            checked={selectedOptions?.includes(item)}
            onChange={handleToggle(item)}
          />
        </ListItemIcon>
        <ListItemText primary={item} />
      </MenuItem>,
    ];

    return items;
  });

  return (
    <Select
      color="Blue"
      multiple
      disabled={disabled}
      value={selectedOptions}
      displayEmpty
      MenuProps={{
        variant: "menu",
        anchorOrigin: { vertical: "bottom", horizontal: "left" },
        transformOrigin: { horizontal: "left" },
      }}
      renderValue={(selected) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            width: "100%",
            justifyContent: "space-between",
            height: "3.2rem",
          }}
        >
          <Typography sx={{ color: TypeSecondary }}>{label}</Typography>
          <Avatar
            sx={{
              bgcolor: MarutiBlue500,
              width: 18,
              height: 18,
              display: selected?.length > 0 ? "inherit" : "none",
            }}
          >
            {selected?.length}
          </Avatar>
          <CloseIcon
            sx={{
              marginLeft: "auto",
              display: selected?.length > 0 ? "inherit" : "none",
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
      <MenuItem
        key={"bbjjbkjb"}
        className={`prodigi-multiselect-group ${
          selectedOptions?.length === options?.length
            ? "prodigi-multi-selected"
            : ""
        }`}
        value={"All"}
        onClick={handleToggle("All")}
        selected={selectedOptions?.length === options?.length}
      >
        <ListItemIcon>
          <Checkbox
            size="large"
            color="Blue"
            disableRipple
            checked={selectedOptions?.length === options?.length}
            onChange={handleToggle("All")}
          />
        </ListItemIcon>
        <ListItemText primary={"All"} />
      </MenuItem>
      <Divider
        key={"ghjgbkj"}
        sx={{ mt: "0.6rem !important", mb: "0.6rem !important" }}
      />
      {menuItems}
    </Select>
  );
};
export default MultiSelect;
