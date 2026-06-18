import { createTheme } from "@mui/material/styles";
import {
  Blue,
  Green,
  Grey10,
  Grey20,
  MarutiBlack,
  MarutiBlue500,
  MarutiSilver400,
  MarutiWhite,
  Red,
  TypePrimary,
  TypeSecondary,
  TypeTertiary,
  Yellow,
} from "../../utils/colors";

export const ProdigiTheme = createTheme({
  palette: {
    primary: {
      main: MarutiBlue500,
    },
    neutral: {
      main: MarutiBlue500,
      contrastText: "#fff",
    },
    first: {
      main: "#CE2A96",
    },
    Blue: {
      main: MarutiBlue500,
      contrastText: "#fff",
    },
    White: {
      main: MarutiWhite,
    },
    DarkGrey: {
      main: MarutiSilver400,
    },
    Base: {
      main: "#CE2A96",
    },
    LightBlue: {
      main: Blue,
    },
    Red: {
      main: Red,
    },
    Yellow: {
      main: Yellow,
    },
    Green: {
      main: Green,
    },
    Grey: {
      main: TypeSecondary,
    },
    LightGrey: {
      main: Grey10,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: window.screen.width <= 1280 ? (600 * 80) / 100 : 600,
      md: window.screen.width <= 1280 ? (900 * 80) / 100 : 900,
      lg: window.screen.width <= 1280 ? (1200 * 80) / 100 : 1200,
      xl: window.screen.width <= 1280 ? (1536 * 80) / 100 : 1536,
    },
  },
  typography: {
    root: {
      fontFamily: "Roboto",
    },
    caption: {
      fontFamily: "Roboto !important",
      fontSize: "1.2rem",
      lineHeight: "1.4rem",
      letterSpacing: "-0.025em",
    },
    body1: {
      fontSize: "1.4rem",
      lineHeight: "1.6rem",
      letterSpacing: "-0.025em",
    },
    body2: {
      fontSize: "1.2rem",
      lineHeight: "1.6rem",
      letterSpacing: "-0.025em",
      fontWeight: 400,
    },
    body3: {
      fontSize: "1.4rem",
      lineHeight: "1.6rem",
      letterSpacing: "-0.035em",
      fontWeight: 600,
    },

    body4: {
      fontSize: "1.6rem",
      lineHeight: "1.6rem",
      letterSpacing: "-0.04em",
      fontWeight: 600,
    },
    body5: {
      borderRadius: "3rem",
      fontSize: "1.2rem",
      padding: "0 0.8rem",
      fontweight: 400,
      lineHeight: "1.6rem",
      letterSpacing: "-0.03rem",
    },

    body6: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: "1.6rem",
      letterSpacing: "-0.025rem",
    },
    title1: {
      fontFamily: "Roboto",
      fontSize: "1.75rem",
      lineHeight: "1.9rem",
      fontWeight: 600,
      color: TypePrimary,
      letterSpacing: "-0.025em",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2.4rem",
      lineHeight: "2.8rem",
      letterSpacing: "-0.025em",
      color: "#343536",
    },
    h3: {
      fontWeight: "normal",
      fontSize: "2.0rem",
      lineHeight: "2.4rem",
      letterSpacing: "-0.025em",
      color: "#9EA1A7",
    },
    h4: {
      fontWeight: "bold",
      fontSize: "1.6rem",
      lineHeight: "2rem",
      letterSpacing: "-0.025em",
      color: "#343536",
    },
    h5: {
      fontWeight: "bold",
      fontSize: "1.4rem",
      lineHeight: "1.6rem",
      letterSpacing: "-0.025em",
    },
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          width: "100%",
          border: "1px solid #e6e9f0",
          borderRadius: "0.8rem",
          boxShadow: "none",
          "&.prodigi-paper": {
            padding: "1.7rem",
            display: "flex",
            // width:"100%",
            flexDirection: "column",
          },
        },
      },
    },

    // //table
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: "0.8rem !important",
          boxShadow: "none",
          border: `0.1rem solid ${Grey20}`,
          "&.prodigi-dialog-table": {
            border: "none",
            "& .MuiTableCell-root": {
              padding: "0.5rem 0 !important",
              borderBottom: "none !important",
            },
            "& .MuiTableRow-root": {
              "&:hover": {
                backgroundColor: "transparent !important",
              },
            },
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: "inherit",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "0.8rem !important",
        },
        head: {
          fontWeight: "600 !important",
          fontSize: "1.4rem !important",
          lineHeight: "1.6rem !important",
          letterSpacing: "-0.025em !important",
          color: `${MarutiBlue500} !important`,
        },
        body: {
          fontWeight: "normal",
          fontSize: "1.4rem !important",
          lineHeight: "1.6rem !important",
          letterSpacing: "-0.025em !important",
          color: TypeSecondary,
        },
        footer: {
          padding: "0rem !important",
          "&:hover": {
            backgroundColor: `${MarutiWhite} !important`,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: `${Grey20} !important`,
            "&.active": {
              backgroundColor: `${MarutiBlue500} !important`,
              "& .MuiTableCell-root": {
                color: `${MarutiWhite} !important`,
              },
            },
          },
          "&.active": {
            backgroundColor: MarutiBlue500,
            "& .MuiTableCell-root": {
              color: `${MarutiWhite} !important`,
            },
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: "0.5rem",
          borderRadius: "4rem",
        },
      },
    },

    //Tabs
    MuiTabPanel: {
      styleOverrides: {
        root: {
          padding: "1.3rem 0rem 0rem 0rem !important",
          flex: 1,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        textColorPrimary: {
          fontFamily: "Roboto",
          fontWeight: "normal",
          fontSize: "1.4rem !important",
          lineHeight: "1.6rem !important",
          letterSpacing: "-0.025em !important",
          color: TypeSecondary,
          textTransform: "inherit !important",
          minWidth: "fit-content !important",
          width: "fit-content !important",
          minHeight: "3.2rem !important",
          "& .bulk-tab-title .bulk-tab-subtitle": {
            fontWeight: "normal",
          },
        },
        root: {
          "&.MuiButtonBase-root": {
            height: "3.2rem !important",
          },
          "&.Mui-selected": {
            fontWeight: "600 !important",
            color: `${MarutiBlue500} !important`,
            "& .MuiTouchRipple-child": {
              backgroundColor: `${MarutiBlue500} !important`,
            },
          },
          "&.prodigi-tab": {
            "&.Mui-selected": {
              backgroundColor: "#F4F5F8",
              borderRadius: "0.8rem 0.8rem 0 0",
            },
          },
          "&.break-down-tab": {
            "&.Mui-selected": {
              backgroundColor: "#171C8F",
              borderRadius: "5rem",
              color: `${MarutiWhite}!important`,
              "& .MuiTouchRipple-child": {
                backgroundColor: `${Red} !important`,
              },
            },
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: "fit-content !important",
        },
        indicator: {
          backgroundColor: `${MarutiBlue500}`,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          scrollbarWidth: "thin", // For Firefox
          scrollbarColor: "#c4c4c4 transparent", // For Firefox
          "&::-webkit-scrollbar": {
            width: "5px", // For WebKit browsers
            height: "5px", // For horizontal scrollbars in WebKit browsers
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent", // Transparent track
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#c4c4c4", // Thumb color
            "&:hover": {
              backgroundColor: "#97999B !important", // Thumb color on hover
            },
            borderRadius: "10px", // Rounded thumb edges
            border: "none", // No border around the thumb
          },
        },
      },
    },

    // //dialog
    MuiDialog: {
      styleOverrides: {
        root: {
          "&.prodigi-dialog": {
            "& .MuiDialogTitle-root": {
              padding: "1.2rem",
            },
            "& .MuiDialogContent-root": {
              padding: "0 1.2rem 1.2rem 1.2rem",
            },
          },
        },
      },
    },
    // // select
    MuiList: {
      styleOverrides: {
        padding: {
          padding: "0.8rem",
        },
        root: {
          maxHeight: "60vh",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        gutters: {
          "&.prodigi-multiselect-item": {
            paddingTop: "0rem",
            paddingBottom: "0rem",
            "& .MuiListItemIcon-root": {
              minWidth: 0,
            },
          },
          "&.prodigi-multiselect-grouped-item": {
            paddingTop: "0rem",
            paddingBottom: "0rem",
            "& .MuiListItemIcon-root": {
              minWidth: 0,
            },
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        gutters: {
          fontStyle: "normal !important",
          fontWeight: "normal !important",
          fontSize: "1.4rem !important",
          lineHeight: "1.6rem !important",
          letterSpacing: "-0.025em !important",
          color: `${TypeSecondary} !important`,
          borderBottom: `0.1rem solid ${Grey20} !important`,
          "&.grouped-select": {
            borderBottom: "none !important",
            paddingLeft: "3rem",
          },
          "&.prodigi-multiselect-group": {
            paddingTop: "0rem",
            paddingBottom: "0rem",
            paddingLeft: "0rem",
            paddingRight: "1rem",
            borderBottom: "none !important",
          },

          "&.prodigi-multiselect-item": {
            paddingTop: "0rem",
            paddingBottom: "0rem",
            paddingLeft: "0rem",
            paddingRight: "1rem",
            borderBottom: "none !important",
            "& .MuiListItemIcon-root": {
              minWidth: 0,
            },
          },
          "&.prodigi-multiselect-grouped-item": {
            paddingTop: "0rem",
            paddingBottom: "0rem",
            paddingLeft: "0rem",
            paddingRight: "1rem",
            borderBottom: "none !important",
            "& .MuiListItemIcon-root": {
              minWidth: 0,
            },
          },
          "&.prodigi-multi-selected": {
            backgroundColor: "rgba(25, 118, 210, 0.08)",
          },
        },
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          fontStyle: "normal !important",
          fontWeight: "normal !important",
          fontSize: "1.4rem !important",
          lineHeight: "1.6rem !important",
          letterSpacing: "-0.025em !important",
          color: `${TypeTertiary} !important`,
          paddingBottom: "1rem",
          paddingTop: "1rem",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          height: "3.2rem",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        outlined: {
          fontFamily: "Roboto !important",
          fontStyle: "normal !important",
          fontWeight: "normal !important",
          fontSize: "1.4rem !important",
          lineHeight: "1.6rem !important",
          letterSpacing: "-0.025em !important",
          color: " #000000 !important",
          padding: "1rem",
          "&.MuiInputBase-input": {
            paddingRight: "2.7rem",
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          width: "fit-content",
          boxShadow: "0px 10px 20px 0px rgba(0, 0, 0, 0.06)",
          scrollbarWidth: "thin",
          scrollbarColor: "#c4c4c4 #f4f5f8",
          "&::-webkit-scrollbar": {
            width: " 1.2rem",
          },
          "&::-webkit-scrollbar-track": {
            background: " #ffffff",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#c4c4c4",
            "&:hover": {
              backgroundColor: "#97999B !important",
            },
            height: "3rem",
            borderRadius: "2rem",
            border: "0.4rem solid #ffffff",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "&.prodigi-input": {
            "& .MuiOutlinedInput-root": {
              paddingLeft: "1.2rem",
              paddingRight: "0.6rem",
              "&>.MuiOutlinedInput-input": {
                paddingLeft: "0rem",
              },
            },
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#fff",
          color: MarutiBlack,
          fontSize: "1.2rem",
          maxWidth: "80rem",
          boxShadow: "0px 10px 20px 10px rgba(0, 0, 0, 0.06)",

          padding: "1.8rem",
        },
        arrow: {
          color: "#fff",
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: "4rem",
          backgroundColor: "#D9D9D9",
        },
      },
    },
  },
});
