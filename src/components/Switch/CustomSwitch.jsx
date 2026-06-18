import { Stack, Typography } from "@mui/material";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import {
  Grey30,
  MarutiBlue500,
  TypePrimary,
  TypeTertiary,
} from "../../utils/colors";

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  padding: 7,
  "& .MuiSwitch-switchBase": {
    "&.Mui-checked": {
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: Grey30,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: MarutiBlue500,
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: Grey30,
  },
}));
export default function CustomSwitch({ sx = {}, ...props }) {
  return (
    <Stack sx={sx} direction="row" spacing={1} alignItems="center">
      <Typography
        variant="h5"
        sx={{
          color: props.checked ? TypeTertiary : TypePrimary,
          fontWeight: props.checked ? "normal" : "bold",
        }}
      >
        {props.leftLabel}
      </Typography>
      <MaterialUISwitch
        size="small"
        checked={props.checked}
        onChange={props.handleChange}
        inputProps={{ "aria-label": "controlled" }}
      />
      <Typography
        variant="h5"
        sx={{
          color: props.checked ? TypePrimary : TypeTertiary,
          fontWeight: props.checked ? "bold" : "normal",
        }}
      >
        {props.rightLabel}
      </Typography>
    </Stack>
  );
}
