import { Box, Typography } from "@mui/material";
import useStyles from "../SapLogs.styles";
import Loader from "../../../components/Loader/Loader";
import { MarutiBlue500 } from "../../../utils/colors";

const BottomContainer = ({ loader, end, endMessage }) => {
  const classes = useStyles();

  return (
    <>
      {loader && (
        <Box className={classes["loader-container"]} sx={{ mt: 1 }}>
          <Loader size="SMALL" />
        </Box>
      )}
      {end && !loader ? (
        <Box className={classes["loader-container"]} sx={{ mt: 1 }}>
          <Typography style={{ color: MarutiBlue500 }}>{endMessage}</Typography>
        </Box>
      ) : null}
    </>
  );
};

export default BottomContainer;
