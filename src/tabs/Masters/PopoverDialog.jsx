import CircleIcon from "@mui/icons-material/Circle";
import { Box, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import * as React from "react";

const theme = createTheme({
  typography: {
    root: {
      fontFamily: "Roboto",
    },
    body1: {
      fontSize: "1.4rem",
      lineHeight: "1.6rem",
      letterSpacing: "-0.025em",
    },
  },
  components: {
    MuiPopover: {
      styleOverrides: {
        paper: {
          "&.MuiPaper-root": {
            maxWidth: "600px",
            scrollbarWidth: "thin",
            scrollbarColor: "#c4c4c4 #f4f5f8",
            "&::-webkit-scrollbar": {
              width: " 1.2rem",
              height: " 1.2rem",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#c4c4c4",
              "&:hover": {
                backgroundColor: "#97999B !important",
              },
              borderRadius: "2rem",
              border: "0.4rem solid #ffffff",
            },
          },
        },
      },
    },
  },
});
export default function CustomPopoverDialog(props) {
  return (
    <ThemeProvider theme={theme}>
      <Popover
        id={props.id}
        open={props.open}
        anchorEl={props.anchorEl}
        onClose={props.handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        disableRestoreFocus
      >
        {props.message &&
        props.message !== null &&
        props.message.length !== 0 ? (
          <Box
            sx={{
              p: 2,
            }}
          >
            <Typography sx={{ fontWeight: 700 }}>
              The upload failed because of the following reasons:
            </Typography>
            <List sx={{ height: "40rem" }}>
              {props.message?.map((item, i) => (
                <ListItem key={i}>
                  <ListItemIcon sx={{ minWidth: "fit-content", mr: 1 }}>
                    <CircleIcon fontSize="small" color="Blue.main" />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Box>
        ) : (
          <Box sx={{ p: 2 }}>
            <Typography sx={{ fontWeight: 700 }}>
              The upload failed because of the following reasons:
            </Typography>
            <List sx={{ height: "40rem" }}>
              <ListItem>
                <ListItemIcon sx={{ minWidth: "fit-content", mr: 1 }}>
                  <CircleIcon fontSize="small" color="Blue.main" />
                </ListItemIcon>
                <ListItemText primary="The master file should contain 5 sheets (as named in the master template)" />
              </ListItem>

              <ListItem>
                <ListItemIcon sx={{ minWidth: "fit-content", mr: 1 }}>
                  <CircleIcon fontSize="small" color="Blue.main" />
                </ListItemIcon>
                <ListItemText primary="There should be no empty rows after the header and description in sheet number 1" />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{ minWidth: "fit-content", mr: 1 }}>
                  <CircleIcon fontSize="small" color="Blue.main" />
                </ListItemIcon>
                <ListItemText primary="No empty columns are allowed in any row in sheet 2 except column H and I" />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{ minWidth: "fit-content", mr: 1 }}>
                  <CircleIcon fontSize="small" color="Blue.main" />
                </ListItemIcon>
                <ListItemText primary="Sheet 5 should have at least 1 column entry for each row which has column entry in A and B" />
              </ListItem>
            </List>
          </Box>
        )}
      </Popover>
    </ThemeProvider>
  );
}
