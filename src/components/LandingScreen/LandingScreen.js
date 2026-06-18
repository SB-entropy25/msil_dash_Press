import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import IotLogo from "../../assets/icons/IotLogo.svg";
import MSLogoWhite from "../../assets/icons/MSLogoWhite.svg";
import { MarutiWhite } from "../../utils/colors";
import { landingStyles } from "./LandingScreen.styles";

const LandingScreen = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("/Prodigi");
  };
  return (
    <Box sx={landingStyles.landingRoot}>
      <img
        style={landingStyles.landingMsLogo}
        alt="ms-logo"
        src={MSLogoWhite}
      />
      <Box sx={landingStyles.landingBoxContainer}>
        <Box sx={landingStyles.landingBox}>
          <Box sx={landingStyles.landingBoxLogo}>
            <img
              style={{ height: "8.387rem", width: "53.953rem" }}
              alt="iot-logo"
              src={IotLogo}
            />
          </Box>
          <Box sx={landingStyles.landingBoxButton}>
            <Button
              sx={landingStyles.landingButton}
              color="White"
              variant="outlined"
              onClick={handleExploreClick}
            >
              Explore IoT SPACE
            </Button>
          </Box>
          <Typography variant="h3" sx={{ color: MarutiWhite }}>
            Smart Platform for Accelerating Connected Environment
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
export default LandingScreen;
