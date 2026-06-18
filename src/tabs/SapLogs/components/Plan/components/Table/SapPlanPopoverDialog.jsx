import { Box, Popover, Typography } from "@mui/material";
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

export default function SapPlanPopoverDialog({
  id,
  open,
  anchorEl,
  handleClose,
  errorData,
}) {
  return (
    <ThemeProvider theme={theme}>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        disableRestoreFocus
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
            {"Error log"}
          </Typography>
          {errorData?.map((item, i) => (
            <Box key={i} sx={{ p: 1, mb: 1, minWidth: "40rem" }}>
              <Typography variant="body1">{item?.error_message}</Typography>
            </Box>
          ))}
        </Box>
      </Popover>
    </ThemeProvider>
  );
}
