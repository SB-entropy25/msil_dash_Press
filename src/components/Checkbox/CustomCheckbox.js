import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import * as React from "react";
import { Grey30, MarutiBlue500 } from "../../utils/colors";

export default function CustomCheckbox(props) {
  return (
    <FormControlLabel
      value="end"
      sx={{ margin: props.center ? "0 0 0 0" : "" }}
      control={
        <Checkbox
          disabled={props?.disabled}
          disableRipple
          checked={props.checked}
          onChange={props.handleChange}
          sx={{
            padding: props.center ? "0 0 0 0" : "0rem 1rem 0rem 0rem",
            color: Grey30,
            "&.Mui-checked": {
              color: MarutiBlue500,
            },
            "& .MuiSvgIcon-root": { fontSize: 18 },
          }}
        />
      }
      label={props.label ? props.label : ""}
      labelPlacement="end"
    />
  );
}
