import { Box, CircularProgress } from "@mui/material";
import { MarutiBlue500 } from "../../utils/colors.js";

const sizes = {
  SMALL: 15,
  MEDIUM: 40,
  small: 15,
};
const Loader = ({
  size = "MEDIUM",
  color = "Blue",
  loaderColor = MarutiBlue500,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        alignItems: "center",
        alignSelf: "center",
        ...sx,
      }}
    >
      <CircularProgress
        sx={{ color: loaderColor }}
        size={sizes[size]}
        color={color}
      />
    </Box>
  );
};
export default Loader;
