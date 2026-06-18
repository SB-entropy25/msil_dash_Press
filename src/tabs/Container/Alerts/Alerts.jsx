import { Close } from "@mui/icons-material";
import { Badge, Box, IconButton, Menu, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Bell from "../../../assets/icons/Bell.svg";
import DeleteIcon from "../../../assets/icons/delete.svg";
import Loader from "../../../components/Loader/Loader";
import {
  selectNotifications,
  selectNotificationsLoading,
} from "../../../redux/Selectors/NotificationsSelector";
import {
  MarutiSilver400,
  TypePrimary,
  TypeSecondary,
  TypeTertiary,
} from "../../../utils/colors";
import { formatDateTime } from "../../../utils/helperFunctions.utils";
import useStyles from "./Alert.styles";

const Alerts = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const loading = useSelector(selectNotificationsLoading);
  const data = useSelector(selectNotifications);

  useEffect(() => {
    setNotifications(data);
  }, [data]);

  const handleIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = (index) => {
    const newNotifications = [...notifications];
    newNotifications.splice(index, 1);
    setNotifications(newNotifications);
    if (newNotifications.length === 0) {
      handleClose();
    }
  };

  return (
    <Box>
      <IconButton onClick={handleIconClick} disableRipple>
        <Badge
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "1.2rem",
            },
          }}
          badgeContent={notifications?.length}
          color="error"
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <img src={Bell} alt="bell icon" />
        </Badge>
        <Typography
          variant="body1"
          sx={{
            color: TypeSecondary,
            ml: "0.8rem",
            display: "inline-block",
            fontWeight: 400,
          }}
        >
          Alerts
        </Typography>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            style: {
              width: 285,
              marginTop: "3.4rem",
            },
          },
        }}
      >
        <Box
          className={classes["container-flex"]}
          sx={{
            mb: "1.3rem",
            mt: "0.9rem",
          }}
        >
          <Typography variant="body2" sx={{ color: TypeSecondary }}>
            Alerts
          </Typography>
          <Close
            onClick={handleClose}
            sx={{ color: MarutiSilver400, cursor: "pointer" }}
          />
        </Box>
        <Box className={classes["alerts-items-container"]}>
          {loading ? (
            <Loader size="SMALL" />
          ) : notifications?.length > 0 ? (
            notifications?.map((item, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: "#F4F5F8",
                  mb: "1.2rem",
                  borderRadius: "0.4rem",
                  padding: "0.8rem 1.2rem",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.4rem",
                  }}
                >
                  <Typography sx={{ color: TypeTertiary }} variant="body2">
                    {formatDateTime(item?.created_at)}
                  </Typography>
                  <img
                    src={DeleteIcon}
                    style={{
                      height: "1.6rem",
                      width: "1.6rem",
                      cursor: "pointer",
                    }}
                    onClick={() => handleDelete(index)}
                  />
                </Box>
                <Box sx={{ Width: "21.5rem", flexWrap: "wrap" }}>
                  <Typography variant="h4" sx={{ color: TypePrimary }}>
                    {item?.alert_type}
                  </Typography>
                  <Box sx={{ Width: "21.5rem", flexWrap: "wrap" }}>
                    {item?.notification?.split(";")?.map((value, index) => (
                      <Typography
                        key={index}
                        variant="body1"
                        sx={{ color: TypePrimary }}
                      >
                        {value}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Box
              key={new Date()}
              sx={{
                backgroundColor: "#F4F5F8",
                mb: "1.2rem",
                borderRadius: "0.4rem",
                padding: "0.8rem 1.2rem",
              }}
            >
              <Typography sx={{ color: TypeTertiary }} variant="body2">
                No Alert found
              </Typography>
            </Box>
          )}
        </Box>
      </Menu>
    </Box>
  );
};

export default Alerts;
