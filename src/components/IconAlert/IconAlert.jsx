import { Box, Typography } from "@mui/material";
import { StatusGrey } from "../../utils/colors";
import { getBarGraphHeight } from "../../utils/helperFunctions.utils";

const IconAlert = ({ children, title = "" }) => {
  return (
    <Box
      sx={{
        height: getBarGraphHeight(),
        width: "100%",
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
        <Typography variant="h2" sx={{ color: StatusGrey }}>
          {title}
        </Typography>
      </Box>
    </Box>
  );
};
export default IconAlert;
