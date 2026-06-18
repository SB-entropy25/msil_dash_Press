import Box from "@mui/material/Box";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { useEffect, useState } from "react";
import { ProdigiTheme } from "../../utils/theme/theme";

import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Logout from "../../assets/icons/Logout.svg";
import IotBlueLogo from "../../assets/icons/IotBlueLogo.svg";
import MSLogo from "../../assets/icons/MSLogo.svg";
import UserIcon from "../../assets/icons/User.svg";
import DownIcon from "../../assets/icons/down_grey.svg";
import Loader from "../Loader/Loader";
import { getUser, logoutSession } from "../../services/auth";
import { appbarStyles } from "./styles";
import { useLocation } from "react-router-dom";

const Navigation = ({}) => {
  const [anchorAdminEl, setAnchorAdminEl] = useState(null);
  const openAdmin = Boolean(anchorAdminEl);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("user");

  const location = useLocation();

  useEffect(() => {
    if (getUser() && getUser()?.username) {
      const cred = getUser()?.username?.split("\\");
      if (cred) {
        let user;
        if (cred.length === 1) {
          user = cred[0];
        } else {
          // user = cred[0] + "%5C" + cred[1];
          user = cred[1];
        }
        setUsername(user);
      } else {
        setUsername(getUser()?.username);
      }
    }
  }, [location.pathname]);

  const handleAdminMenuClick = (event) => {
    setAnchorAdminEl(event.currentTarget);
  };
  const handleAdminMenuClose = () => {
    setAnchorAdminEl(null);
  };
  return (
    <ThemeProvider theme={ProdigiTheme}>
      <Box position="fixed" sx={appbarStyles.msilAppbar}>
        <Box sx={appbarStyles.header}>
          <img
            alt="mainLogo"
            src={IotBlueLogo}
            style={{
              height: "2.7rem",
              width: "17.369rem",
              cursor: "pointer",
            }}
          />
        </Box>
        <Box sx={appbarStyles.header}>
          <img
            style={{ height: "2rem", width: "18.6rem" }}
            alt="MSIL Logo"
            src={MSLogo}
          />
        </Box>
        <Box
          style={{
            ...appbarStyles["profile-container"],
            marginLeft: "1.5rem",
          }}
          onClick={handleAdminMenuClick}
        >
          <span>{username}</span>
          <img
            alt="User"
            style={{
              height: "1.6rem",
              width: "1.6rem",
              marginLeft: "1.2rem",
            }}
            src={UserIcon}
          />
          <img
            style={{ height: "0.448rem", width: "0.778rem" }}
            alt="Down"
            src={DownIcon}
          />
        </Box>
        <Menu
          className="logout"
          id="basic-menu"
          anchorEl={anchorAdminEl}
          open={openAdmin}
          onClose={handleAdminMenuClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem
            onClick={() => {
              logoutSession();
              setLoading(true);
            }}
            sx={{ display: !loading ? "flex" : "none" }}
          >
            <ListItemText>Sign out</ListItemText>
            <img
              alt="logout"
              src={Logout}
              style={{
                marginLeft: "2rem",
                height: "1.6rem",
                width: "1.6rem",
              }}
            />
          </MenuItem>
          <MenuItem sx={{ display: loading ? "flex" : "none" }}>
            <ListItemText>
              <Loader type={"SMALL"} />
            </ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </ThemeProvider>
  );
};
export default Navigation;
