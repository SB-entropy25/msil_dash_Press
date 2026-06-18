import { Box, Typography, Popover } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import * as React from "react";
import { formatDateTime } from "../../../../../../utils/helperFunctions.utils";
import { Grey10 } from "../../../../../../utils/colors";

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

const statusText = {
  FAILURE: "Failure",
  IN_PROCESS: "In Process",
  SUCCESS: "Success",
};

export default function SapPopoverDialog({
  id,
  open,
  anchorEl,
  handleClose,
  attempts,
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
            {"Data update time log"}
          </Typography>
          {attempts?.map((item, i) => (
            <Box
              key={i}
              sx={{ backgroundColor: Grey10, p: 1, mb: 1, minWidth: "40rem" }}
            >
              <Typography variant="body1">{`Attempt: ${item?.attempt_number}`}</Typography>
              <Box sx={{ mt: 0.2 }} />
              <Typography variant="body1">{`Attempt date & time: ${formatDateTime(
                item?.attempt_time,
                "DD-MM-YY | hh:mm:ss a"
              )}`}</Typography>
              <Box sx={{ mt: 0.2 }} />
              <Typography variant="body1">{`Status: ${
                statusText[item?.status]
              }`}</Typography>
              <Box sx={{ mt: 0.2 }} />
              <Typography variant="body1">{`Remark: ${
                item?.error_remarks || "-"
              }`}</Typography>
            </Box>
          ))}
        </Box>
      </Popover>
    </ThemeProvider>
  );
}
