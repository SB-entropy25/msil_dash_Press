import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import createTheme from "@mui/material/styles/createTheme";
import React, { useRef, useState } from "react";
import CheckIcon from "../../assets/icons/check.svg";
import { TypePrimary } from "../../utils/colors";
import ArrowTooltip from "../ArrowTooltip/ArrowTooltip";
import Loader from "../Loader/Loader";
import useStyles from "./CheckTextfield.styles";
import TextFieldWithoutBorder from "./TextfieldWithoutBorder";
export const menuTheme = createTheme({});

const CheckTextfield = ({
  name,
  value = "",
  onChange = () => {},
  done = false,
  onSubmit = () => {},
  remark = "",
  onSelectChange = () => {},
  options = [],
  loading = false,
  disabled = false,
}) => {
  const classes = useStyles();
  const [openSelect, setOpenSelect] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const childRef = useRef(null);

  const handleCloseSelect = () => {
    setOpenSelect(false);
    setAnchorEl(null);
  };

  const handleMenuItemClick = (value) => {
    onSelectChange(value);
    setAnchorEl(null);
    childRef.current.focusTextInput();
  };

  const handleClick = (event) => {
    if (!done) {
      if (!openSelect) {
        setAnchorEl(event.currentTarget);
        setOpenSelect(true);
      } else {
        setOpenSelect(false);
        setAnchorEl(null);
      }
    }
  };

  const handleEnterPress = (event) => {
    if (event.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <ArrowTooltip message={value} show={done}>
      <Box className={classes["custom-prodigi-textfield"]}>
        <TextFieldWithoutBorder
          disabled={done || disabled}
          done={done}
          onKeyPress={handleEnterPress}
          ref={childRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <Box
          className={classes["custom-prodigi-select"]}
          onClick={handleClick}
          sx={{ visibility: disabled ? "hidden" : "inherit" }}
        >
          {loading ? (
            <Loader size="SMALL" />
          ) : done ? (
            <img src={CheckIcon} alt="" />
          ) : openSelect ? (
            <KeyboardArrowUpIcon
              className={classes["image-link"]}
              fontSize="large"
              sx={{ color: TypePrimary }}
            />
          ) : (
            <KeyboardArrowDownIcon
              className={classes["image-link"]}
              fontSize="large"
              sx={{ color: TypePrimary }}
            />
          )}

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseSelect}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            {options?.map((item, index) => (
              <MenuItem
                selected={remark === item}
                value={item}
                key={index}
                onClick={() => handleMenuItemClick(item)}
              >
                {item}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>
    </ArrowTooltip>
  );
};
export default CheckTextfield;
