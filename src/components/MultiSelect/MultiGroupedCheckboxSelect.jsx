import CloseIcon from "@mui/icons-material/Close";
import {
  Avatar,
  Box,
  Checkbox,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Select,
  Typography,
} from "@mui/material";
import React from "react";
import { MarutiBlue500, TypeSecondary } from "../../utils/colors";

const MultiGroupedCheckboxSelect = ({
  handleGroupToggle,
  handleClearAll,
  label,
  selectedOptions = [],
  options,
  name,
}) => {
  const menuItems = options.flatMap((item, index) => {
    const items = [
      <ListSubheader className="grouped-select" key={index}>
        {item?.label}
      </ListSubheader>,
    ];
    if (item.label !== "All") {
      items.push(
        item.options?.map((item) => (
          <ListItemButton
            className="prodigi-multiselect-grouped-item"
            key={item}
            value={item}
            selected={selectedOptions?.includes(item)}
            onClick={handleGroupToggle(item, label)}
          >
            <ListItemIcon>
              <Checkbox
                size="large"
                color="Blue"
                disableRipple
                sx={{ paddingLeft: 0 }}
                checked={selectedOptions?.includes(item)}
              />
            </ListItemIcon>
            <ListItemText primary={item} />
          </ListItemButton>
        ))
      );
    }
    items.push(
      <Divider
        key={new Date() + index}
        sx={{ mt: "0.6rem !important", mb: "0.6rem !important" }}
      />
    );
    return items;
  });
  return (
    <Select
      color="Blue"
      multiple
      value={selectedOptions}
      displayEmpty
      MenuProps={{
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "left",
        },
        transformOrigin: {
          horizontal: "left",
        },
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
      {menuItems}
    </Select>
  );
};
export default MultiGroupedCheckboxSelect;
